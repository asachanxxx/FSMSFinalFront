import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Vehicle } from '../../model/Vehicle.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GlobalConfig } from '../../service/globalconfig.service';
import { HttpHeaders } from '@angular/common/http';
import { Customer } from '../../model/Customer.model';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtInstance: DataTables.Api;
  //Confirm and popover messages for insert update delete
  popoverTitle: string = this.gloconfig.GetmessageCaption;
  popoverMessageSave: string = this.gloconfig.GetconfirmInsert;
  popoverMessageUpdate: string = this.gloconfig.GetconfirmModify;
  popoverMessageDelete: string = this.gloconfig.GetconfirmDelete;
  confirmText: string = 'Yes <i class="glyphicon glyphicon-ok"></i>';
  cancelText: string = 'No <i class="glyphicon glyphicon-remove"></i>';
  private customHeaders: HttpHeaders = this.setCredentialsHeader();
  myform: FormGroup;
  selectedRow: any;
  selectedItem: Vehicle;
  holdvar: Vehicle[] = [];
  filterholder: Vehicle[];
  obj: Vehicle = new Vehicle();
  customers:Array<Customer>;
  //Variables for error and sucess messages
  issuccess = false;
  iserror = false;
  successmsg = "Inisizlising success message";
  errormsg = "Inisizlising success message";
  //************************************************************************** constructor ***************************************
  constructor(private _http: HttpClient, private gloconfig: GlobalConfig,
    private formBuilder: FormBuilder) { }
  //************************************************************************** Messaging MEthods ***************************************
  showSuccess(message: string) {
    this.issuccess = true;
    this.iserror = false;
    this.successmsg = message;
    setTimeout(() => {
      this.issuccess = false;
      this.iserror = false;
    }, 5000);
    this.selectedItem = new Vehicle();
  }
  showError(message: string) {
    this.errormsg = message
    this.issuccess = false;
    this.iserror = true;
    setTimeout(() => {
      this.issuccess = false;
      this.iserror = false;
    }, 5000);
  }
  //************************************************************************** Validations ***************************************
  //Validation
  isFieldValid(field: string) {
    return !this.myform.get(field).valid && this.myform.get(field).touched;
  }
  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }
  //************************************************************************** OnInit ***************************************
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.myform = this.formBuilder.group({
      Id:[null],
      CreditCusId: [""],
      // RFID_Id: [""],
      CreditLimit: [""],
      ChequeLimit: [""],
      Outstanding: [""],
      // RFIDNo: [""],
      RegistrationNo: [""],
      VehicleName: [""],
      EngineNo: [""],
      ChassesNo: [""],
      VehicleType: [""],
      // FuelType: [""],
      Make: [""],
      Model: [""],
      EngineCapacity: [""],
      Weight: [""],
      Remark: [""],
    });
    this.Filter();
    this.switchData();
    this.showSuccess("Program Inisialized");
    this.customers = new Array<Customer>();
    this.getCcustomers();
  }


  getCcustomers(){
    let hed: HttpHeaders = new HttpHeaders();
    this._http.get<Customer[]>(this.gloconfig.GetConnection("Customer", "GetAll"))
      .subscribe(
      data => {
        this.customers = data;
      },
      err => {
        console.log(err)
      },
      () => {
        console.log("Finish", this.holdvar)
      });
  }

  
  //************************************************************************** ngAfterViewInit ***************************************
  ngAfterViewInit(): void {
    console.log("ngAfterViewInit", this.holdvar);
    this.dtTrigger.next();
  }

  setCredentialsHeader() {
    let headers = new HttpHeaders();
    let credentials = window.localStorage.getItem('credentials2');
    let token = "RcF2kW7g6KKscCTR3 -YoMJjzhAPxCXufe3fy2NXiIlm8NGtUqbrvzQtCcrIByxNqmav_vFacZmhAX22A8MRnl6JCy6ATUDeAz-dE_H6pHgQzGbYK0pbKv06H3a-QGiYsM-a5ASlLEbe1lRD4cGVmkpVBoIdIj6Qw9H9QvZPaZP8o2bnVCxD8ag8ceinYKPYxHKKdO8JsPxjuMk_T1Vlm39vPGYDJC5_45xgF4jcsqxoNLy95bHUhSzvZgsf2jMqG-dwutfcZOAxCtfZ-1FYRvpjre3TWvqySdx59GW5WKpGqbRjZJuvoBLMDQu20fj4pxwzRXYTOvj12GfJ_Vgj9Rz_bCKHkChaBxRm2--UF6CG3okVTSaqPcyqJ0q-PqIDUqa3E23CWOm9v20XzhiLjiUk6gz8kFgomu1zHQibQXa9mLw_N9ATdYp1xXfqCkd7SukmeCmTT-0r_sQJYHFXxhUUUuqeCzXmEf3RpkX5xytjFExOrLbgpN6vIu772FMWO"
    headers.append('Authorization', 'Bearer ' + token);
    return headers;
  }
  //************************************************************************** Filter ***************************************
  Filter() {
    let hed: HttpHeaders = new HttpHeaders();
    this._http.get<Vehicle[]>(this.gloconfig.GetConnection("Vehicle", "GetAll"), { headers: this.customHeaders })
      .subscribe(
      data => {
        this.filterholder = data;
      },
      err => {
        console.log(err)
      },
      () => {
        this.holdvar = this.filterholder;
        this.switchData();
        console.log("Finish", this.holdvar)
      });
  }
  //************************************************************************** tswitchData ***************************************
  switchData(): void {
    //in first call on OnInit this.dtElement.dtInstance is not construct and check it for undefinned
    if (this.dtElement.dtInstance !== undefined) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Switch
        this.holdvar = this.filterholder; //this.data[id];
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }
  }
  //************************************************************************** setClickedRow ***************************************
  setClickedRow(item: any, i: any) {
    this.selectedRow = i;
    this.selectedItem = item;
  }
  onSubmit(myform, event, btn) {
    this.obj.Id = myform.value.Id
    if (myform.value.CreditCusId === "" || myform.value.CreditCusId === null || myform.value.CreditCusId === undefined) {
      this.obj.CreditCusId = 1
    }
    else {
      this.obj.CreditCusId = myform.value.CreditCusId
    }
    if (myform.value.RFID_Id === "" || myform.value.RFID_Id === null || myform.value.RFID_Id === undefined) {
      this.obj.RFID_Id = 0
    }
    else {
      this.obj.RFID_Id = myform.value.RFID_Id
    }
    if (myform.value.CreditLimit === "" || myform.value.CreditLimit === null || myform.value.CreditLimit === undefined) {
      this.obj.CreditLimit = 0
    }
    else {
      this.obj.CreditLimit = myform.value.CreditLimit
    }
    if (myform.value.ChequeLimit === "" || myform.value.ChequeLimit === null || myform.value.ChequeLimit === undefined) {
      this.obj.ChequeLimit = 0
    }
    else {
      this.obj.ChequeLimit = myform.value.ChequeLimit
    }
    if (myform.value.Outstanding === "" || myform.value.Outstanding === null || myform.value.Outstanding === undefined) {
      this.obj.Outstanding = 0
    }
    else {
      this.obj.Outstanding = myform.value.Outstanding
    }
    if (myform.value.RFIDNo === "" || myform.value.RFIDNo === null || myform.value.RFIDNo === undefined) {
      this.obj.RFIDNo = " - "
    }
    else {
      this.obj.RFIDNo = myform.value.RFIDNo
    }
    if (myform.value.RegistrationNo === "" || myform.value.RegistrationNo === null || myform.value.RegistrationNo === undefined) {
      this.obj.RegistrationNo = " - "
    }
    else {
      this.obj.RegistrationNo = myform.value.RegistrationNo
    }
    if (myform.value.VehicleName === "" || myform.value.VehicleName === null || myform.value.VehicleName === undefined) {
      this.obj.VehicleName = " - "
    }
    else {
      this.obj.VehicleName = myform.value.VehicleName
    }
    if (myform.value.EngineNo === "" || myform.value.EngineNo === null || myform.value.EngineNo === undefined) {
      this.obj.EngineNo = " - "
    }
    else {
      this.obj.EngineNo = myform.value.EngineNo
    }
    if (myform.value.ChassesNo === "" || myform.value.ChassesNo === null || myform.value.ChassesNo === undefined) {
      this.obj.ChassesNo = " - "
    }
    else {
      this.obj.ChassesNo = myform.value.ChassesNo
    }
    if (myform.value.VehicleType === "" || myform.value.VehicleType === null || myform.value.VehicleType === undefined) {
      this.obj.VehicleType = " - "
    }
    else {
      this.obj.VehicleType = myform.value.VehicleType
    }
    if (myform.value.FuelType === "" || myform.value.FuelType === null || myform.value.FuelType === undefined) {
      this.obj.FuelType = " - "
    }
    else {
      this.obj.FuelType = myform.value.FuelType
    }
    if (myform.value.Make === "" || myform.value.Make === null || myform.value.Make === undefined) {
      this.obj.Make = " - "
    }
    else {
      this.obj.Make = myform.value.Make
    }
    if (myform.value.Model === "" || myform.value.Model === null || myform.value.Model === undefined) {
      this.obj.Model = " - "
    }
    else {
      this.obj.Model = myform.value.Model
    }
    if (myform.value.EngineCapacity === "" || myform.value.EngineCapacity === null || myform.value.EngineCapacity === undefined) {
      this.obj.EngineCapacity = " - "
    }
    else {
      this.obj.EngineCapacity = myform.value.EngineCapacity
    }
    if (myform.value.Weight === "" || myform.value.Weight === null || myform.value.Weight === undefined) {
      this.obj.Weight =0
    }
    else {
      this.obj.Weight = myform.value.Weight
    }
    if (myform.value.Remark === "" || myform.value.Remark === null || myform.value.Remark === undefined) {
      this.obj.Remark = " - "
    }
    else {
      this.obj.Remark = myform.value.Remark
    }
   
    this.obj.VehicleImage = " - "
    this.obj.GroupOfCompanyID = 1
    this.obj.CreatedUser = this.gloconfig.GetlogedInUserID;
    this.obj.CreatedDate = new Date();
    this.obj.ModifiedUser = this.gloconfig.GetlogedInUserID
    this.obj.ModifiedDate = new Date();
    this.obj.DataTransfer = 1;
    console.log("On submit ," ,  this.obj)
    switch (btn) {
      case 'Insert':
        console.log("On Submit - case insert : ", btn)
        this.obj.Id = -1;
        break;
      default: break;
    }
  }
  //************************************************************************** SAVE CONFIRM ***************************************
  SaveConfirm() {
    if (this.myform.valid) {
      this.Save(this.obj);
      console.log("Saving", this.obj);
    }
    else {
      Object.keys(this.myform.controls).forEach(field => {
        console.log('form errors', field);
        const control = this.myform.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  SaveCancel() {
    console.log("User try to Insert. but cancelled");
  }
  //************************************************************************** SAVE ***************************************
  Save(item: Vehicle) {
    console.log("Save Confirmed!", this.myform.valid);
    this._http.post(this.gloconfig.GetConnection("Vehicle", "SaveAsync"), item)
      .subscribe(
      data => {
        console.log(data)
        this.showSuccess("Record Inserted SuccessFully!");
      },
      err => {
        this.showError("Some Error occured while transaction! Record not Inserted!");
      },
      () => {
        console.log("Finish")
        this.Filter();
        this.switchData();
      })
  }
  //************************************************************************** UPDATE CONFIRM ***************************************
  UpdateConfirm() {
    if (this.myform.valid) {
      this.Update(this.obj);
      console.log("Saving   ", this.obj);
      this.switchData();
    }
    else {
      Object.keys(this.myform.controls).forEach(field => {
        console.log('form errors', field);
        const control = this.myform.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  UpdateCancel() {
    console.log("User try to update. but cancelled");
  }
  //************************************************************************** UPDATE ***************************************
  Update(item: Vehicle) {
    this._http.post(this.gloconfig.GetConnection("Vehicle", "UpdateAsync"), item)
      .subscribe(
      data => {
        console.log(data)
        if (data === true) {
          this.showSuccess("Record Updated SuccessFully!");
        }
      },
      err => {
        this.showError("Some Error occured while transaction! Record not Updated!");
        console.log(err)
      },
      () => {
        console.log("Finish")
        this.Filter();
        this.switchData();
      });
  }
  //************************************************************************** DELETE CONFIRM ***************************************
  deleteConfirm(item: Vehicle) {
    console.log("Deleting:-this.selectedItem  " + item.Id)
    this.Delete(item.Id);
  }
  deleteCancel() {
    console.log("User try to Delete. but cancelled");
  }

  Delete(id: number) {
    this._http.post(`${this.gloconfig.GetConnection("Vehicle", "DeleteAsync")}?id=${id}`, id)
      .subscribe(
      data => {
        console.log(data)
        if (data === true) {
          this.showSuccess("Record Deleted SuccessFully!");
        }
      },
      err => {
        this.showError("Some Error occured while transaction! Record not deleted!");
        console.log(err)
      },
      () => {
        console.log("Finish")
        this.Filter();
        this.switchData();
      });
  }

}
