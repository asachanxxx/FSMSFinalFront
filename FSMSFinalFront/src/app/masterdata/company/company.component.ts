import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Companie } from '../../model/company.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GlobalConfig } from '../../service/globalconfig.service';
import { HttpHeaders } from '@angular/common/http';
import { NgNoValidate } from '@angular/forms/src/directives/ng_no_validate_directive';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, AfterViewInit {

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
  selectedItem: Companie;
  holdvar: Companie[] = [];
  filterholder: Companie[];
  obj: Companie = new Companie();
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
    this.selectedItem = new Companie();
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
      Id: [null],
      CompanyCode:[],
      CompanyName: [],
      OtherBusinessName1: [null],
      Address1: [null],
      Address2: [null],
      Address3: [null],
      Telephone: [null],
      Mobile: [null],
      FaxNo: [null],
      Email: [null],
      WebAddress: [null],
      ContactPerson: [null],
      TaxID1: [null],
      TaxID2: [null],
      TaxRegistrationNumber1: [null],
      TaxRegistrationNumber2: [null],
      StartOfFiscalYear: [null],
      CostingMethod: [null],
      IsVat: [null],
      IsDelete: [null],
      GroupOfCompanyID: [null],
      CreatedUser: [null],
      CreatedDate: [null],
      ModifiedUser: [null],
      ModifiedDate: [null],
      DataTransfer: [null],
    });
    this.Filter();
    this.switchData();
    this.showSuccess("Program Inisialized");
  }

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
    this._http.get<Companie[]>(this.gloconfig.GetConnection("Companie", "GetAll"), { headers: this.customHeaders })
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
    this.obj.CompanyCode = myform.value.CompanyCode
    this.obj.CompanyName = myform.value.CompanyName
    this.obj.OtherBusinessName1 = myform.value.OtherBusinessName1
    this.obj.Address1 = myform.value.Address1
    this.obj.Address2 = myform.value.Address2
    this.obj.Address3 = myform.value.Address3
    this.obj.Telephone = myform.value.Telephone
    this.obj.Mobile = myform.value.Mobile
    this.obj.FaxNo = myform.value.FaxNo
    this.obj.Email = myform.value.Email
    this.obj.WebAddress = myform.value.WebAddress
    this.obj.ContactPerson = myform.value.ContactPerson
    this.obj.TaxID1 = myform.value.TaxID1
    this.obj.TaxID2 = myform.value.TaxID2
    this.obj.TaxRegistrationNumber1 = myform.value.TaxRegistrationNumber1
    this.obj.TaxRegistrationNumber2 = myform.value.TaxRegistrationNumber2
    this.obj.StartOfFiscalYear = myform.value.StartOfFiscalYear
    this.obj.CostingMethod = myform.value.CostingMethod
    this.obj.IsVat = myform.value.IsVat
    this.obj.IsDelete = myform.value.IsDelete
    this.obj.GroupOfCompanyID = myform.value.GroupOfCompanyID
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
  Save(item: Companie) {
    console.log("Save Confirmed!", this.myform.valid);
    this._http.post(this.gloconfig.GetConnection("Companie", "SaveAsync"), item)
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
  Update(item: Companie) {
    this._http.post(this.gloconfig.GetConnection("Companie", "UpdateAsync"), item)
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
  deleteConfirm(item: Companie) {
    console.log("Deleting:-this.selectedItem  " + item.Id)
    this.Delete(item.Id);
  }
  deleteCancel() {
    console.log("User try to Delete. but cancelled");
  }

  Delete(id: number) {
    this._http.post(this.gloconfig.GetConnection("Companie", "DeleteAsync") + `?id =${id}`, id)
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

}//end of the class

