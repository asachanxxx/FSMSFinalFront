
import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Pump } from '../../model/Pump.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GlobalConfig } from '../../service/globalconfig.service';
import { HttpHeaders } from '@angular/common/http';
import { Nozzle } from '../../model/Nozzle.model';
import { FuelType } from '../../model/fuelType.model';

@Component({
  selector: 'app-pumps',
  templateUrl: './pumps.component.html',
  styleUrls: ['./pumps.component.css']
})
export class PumpsComponent implements OnInit {
  FueltypeFinalObj: FuelType[];
  FuelTypeData: FuelType[];
  selectedItemNozzel: Nozzle;
  selectedRowNozzel: any;
  myformNozzel: FormGroup;
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
  selectedItem: Pump;
  holdvar: Pump[] = [];
  filterholder: Pump[];
  obj: Pump = new Pump();
  //Variables for error and sucess messages
  issuccess = false;
  iserror = false;
  successmsg = "Inisizlising success message";
  errormsg = "Inisizlising success message";

  holdvarmodel: Pump[] = [];
  filterholderModel: Pump[] = [];
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
    this.selectedItem = new Pump();
    this.selectedItemNozzel = new Nozzle();
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
      
    // console.log("this.myformNozzel   ", this.myformNozzel);
    // console.log("this.myform   ", this.myform);
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
      Id: [null],
      NoofNozzels: [""],
      PumpName: [""],
      PumpOrderNo: [""],
      NozzelName: [""],
			FuelTypeId: [""],
			UnitPrice: [""],
			LastTotalizerReading: [""],
    });


    // this.myformNozzel = this.formBuilder.group({
    //   Id: [null],
    //   NozzelName: [""],
		// 	FuelTypeId: [""],
		// 	UnitPrice: [""],
		// 	LastTotalizerReading: [""],
    // });
  
    //this.Filter();
    this. GetAllCustomers();
    this.switchData();
    this.showSuccess("Program Inisialized");
    this.Filter2();
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
  // Filter() {
  //   let hed: HttpHeaders = new HttpHeaders();
  //   this._http.get<Pump[]>(this.gloconfig.GetConnection("Pump", "GetAll"), { headers: this.customHeaders })
  //     .subscribe(
  //     data => {
  //       this.filterholder = data;
  //     },
  //     err => {
  //       console.log(err)
  //     },
  //     () => {
  //       this.holdvar = this.filterholder;
  //       this.switchData();
  //       console.log("Finish", this.holdvar)
  //     });
  // }

  Filter2() {
    let hed: HttpHeaders = new HttpHeaders();
    this._http.get<Pump[]>(this.gloconfig.GetConnection("Pump", "GetAllNew"), { headers: this.customHeaders })
      .subscribe(
      data => {
        this.filterholderModel = data;
        console.log("Filter2", data)
      },
      err => {
        console.log(err)
      },
      () => {
        this.holdvarmodel = this.filterholderModel;
        //this.switchData();

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
    console.log( "myform Submit : ",myform);
    this.obj.Id = myform.value.Id
    if (myform.value.NoofNozzels === "" || myform.value.NoofNozzels === null || myform.value.NoofNozzels === undefined) {
      this.obj.NoofNozzels = 0
    }
    else {
      this.obj.NoofNozzels = myform.value.NoofNozzels
    }
    if (myform.value.PumpName === "" || myform.value.PumpName === null || myform.value.PumpName === undefined) {
      this.obj.PumpName = " - "
    }
    else {
      this.obj.PumpName = myform.value.PumpName
    }
    if (myform.value.PumpOrderNo === "" || myform.value.PumpOrderNo === null || myform.value.PumpOrderNo === undefined) {
      this.obj.PumpOrderNo = 0
    }
    else {
      this.obj.PumpOrderNo = myform.value.PumpOrderNo
    }
    this.obj.GroupOfCompanyID = 1
    this.obj.CreatedUser = this.gloconfig.GetlogedInUserID;
    this.obj.CreatedDate = new Date();
    this.obj.ModifiedUser = this.gloconfig.GetlogedInUserID
    this.obj.ModifiedDate = new Date();
    this.obj.DataTransfer = 1;
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
  Save(item: Pump) {
    console.log("Save Confirmed!", this.myform.valid);
    this._http.post(this.gloconfig.GetConnection("Pump", "SaveAsync"), item)
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
        //this.Filter();
        this.Filter2();
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
  Update(item: Pump) {
    this._http.post(this.gloconfig.GetConnection("Pump", "UpdateAsync"), item)
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
        //this.Filter();
        this.Filter2();
        this.switchData();
      });
  }
  //************************************************************************** DELETE CONFIRM ***************************************
  deleteConfirm(item: Pump) {
    console.log("Deleting:-this.selectedItem  " + item.Id)
    this.Delete(item.Id);
  }
  deleteCancel() {
    console.log("User try to Delete. but cancelled");
  }

  Delete(id: number) {
    this._http.post(`${this.gloconfig.GetConnection("Pump", "DeleteAsync")}?id=${id}`, id)
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
        //this.Filter();
        this.Filter2();
        this.switchData();
      });
  }

  setClickedNozzel(item2,item,i){
      console.log("item,i",item,"item2",item2 ,i);

      this.selectedRowNozzel = i;
      this.selectedItemNozzel = item2;
  }

  SaveConfirmNozzel(){
    console.log(this.selectedItemNozzel);
    console.log(this.selectedItem);
    this.selectedItemNozzel.CreatedUser = this.gloconfig.GetlogedInUserID;
    //this.selectedItemNozzel.FuelTypeId = 1;
    this.selectedItemNozzel.PumpId = this.selectedItem.Id;
    this.selectedItemNozzel.GroupOfCompanyID = 1;

    this.SaveNozzel(this.selectedItemNozzel);

    
  }


  SaveNozzel(item: Nozzle) {
    console.log("Save Confirmed! Nozzels !  ", this.selectedItemNozzel);
    this._http.post(this.gloconfig.GetConnection("Nozzle", "SaveAsync"), item)
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
        //this.Filter();
        this.Filter2();
        this.switchData();
      })
  }

  GetAllCustomers() {
    let hed: HttpHeaders = new HttpHeaders();
    this._http.get<FuelType[]>(this.gloconfig.GetConnection("FuelTypesDapper", "GetAll"))
      .subscribe(
        data => {
          this.FuelTypeData = data;
          console.log("FuelTypesDapper  ", data)
        },
        err => {
          console.log(err)
        },
        () => {
          this.FueltypeFinalObj = this.FuelTypeData;
          //this.switchData();

        });
  }

  OnChangePumper(){
    
  }



}//end of class
