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
      CompanyCode: ['', Validators.required],
      CompanyName: ['', Validators.required],
      OtherBusinessName1: [null],
      Address1: [''],
      Address2: [''],
      Address3: [''],
      Telephone: [''],
      Mobile: [''],
      FaxNo: [''],
      Email: [''],
      WebAddress: [''],
      ContactPerson: [''],
      TaxID1: [''],
      TaxID2: [''],
      TaxRegistrationNumber1: [''],
      TaxRegistrationNumber2: [''],
      StartOfFiscalYear: [''],
      CostingMethod: [''],
      IsVat: [''],
      IsDelete: [''],
      GroupOfCompanyID: [''],
      CreatedUser: [''],
      CreatedDate: [''],
      ModifiedUser: [''],
      ModifiedDate: [''],
      DataTransfer: [''],
    });
    this.Filter();
    this.switchData();
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
    this.obj.Id = myform.value.Id
    if (myform.value.CompanyCode === "" || myform.value.CompanyCode === null || myform.value.CompanyCode === undefined) {
      this.obj.CompanyCode = " - "
    }
    else {
      this.obj.CompanyCode = myform.value.CompanyCode
    }
    if (myform.value.CompanyName === "" || myform.value.CompanyName === null || myform.value.CompanyName === undefined) {
      this.obj.CompanyName = " - "
    }
    else {
      this.obj.CompanyName = myform.value.CompanyName
    }
    if (myform.value.OtherBusinessName1 === "" || myform.value.OtherBusinessName1 === null || myform.value.OtherBusinessName1 === undefined) {
      this.obj.OtherBusinessName1 = " - "
    }
    else {
      this.obj.OtherBusinessName1 = myform.value.OtherBusinessName1
    }
    if (myform.value.Address1 === "" || myform.value.Address1 === null || myform.value.Address1 === undefined) {
      this.obj.Address1 = " - "
    }
    else {
      this.obj.Address1 = myform.value.Address1
    }
    if (myform.value.Address2 === "" || myform.value.Address2 === null || myform.value.Address2 === undefined) {
      this.obj.Address2 = " - "
    }
    else {
      this.obj.Address2 = myform.value.Address2
    }
    if (myform.value.Address3 === "" || myform.value.Address3 === null || myform.value.Address3 === undefined) {
      this.obj.Address3 = " - "
    }
    else {
      this.obj.Address3 = myform.value.Address3
    }
    if (myform.value.Telephone === "" || myform.value.Telephone === null || myform.value.Telephone === undefined) {
      this.obj.Telephone = " - "
    }
    else {
      this.obj.Telephone = myform.value.Telephone
    }
    if (myform.value.Mobile === "" || myform.value.Mobile === null || myform.value.Mobile === undefined) {
      this.obj.Mobile = " - "
    }
    else {
      this.obj.Mobile = myform.value.Mobile
    }
    if (myform.value.FaxNo === "" || myform.value.FaxNo === null || myform.value.FaxNo === undefined) {
      this.obj.FaxNo = " - "
    }
    else {
      this.obj.FaxNo = myform.value.FaxNo
    }
    if (myform.value.Email === "" || myform.value.Email === null || myform.value.Email === undefined) {
      this.obj.Email = " - "
    }
    else {
      this.obj.Email = myform.value.Email
    }
    if (myform.value.WebAddress === "" || myform.value.WebAddress === null || myform.value.WebAddress === undefined) {
      this.obj.WebAddress = " - "
    }
    else {
      this.obj.WebAddress = myform.value.WebAddress
    }
    if (myform.value.ContactPerson === "" || myform.value.ContactPerson === null || myform.value.ContactPerson === undefined) {
      this.obj.ContactPerson = " - "
    }
    else {
      this.obj.ContactPerson = myform.value.ContactPerson
    }
    if (myform.value.TaxID1 === "" || myform.value.TaxID1 === null || myform.value.TaxID1 === undefined) {
      this.obj.TaxID1 = 0
    }
    else {
      this.obj.TaxID1 = myform.value.TaxID1
    }
    if (myform.value.TaxID2 === "" || myform.value.TaxID2 === null || myform.value.TaxID2 === undefined) {
      this.obj.TaxID2 = 0
    }
    else {
      this.obj.TaxID2 = myform.value.TaxID2
    }
    if (myform.value.TaxRegistrationNumber1 === "" || myform.value.TaxRegistrationNumber1 === null || myform.value.TaxRegistrationNumber1 === undefined) {
      this.obj.TaxRegistrationNumber1 = " - "
    }
    else {
      this.obj.TaxRegistrationNumber1 = myform.value.TaxRegistrationNumber1
    }
    if (myform.value.TaxRegistrationNumber2 === "" || myform.value.TaxRegistrationNumber2 === null || myform.value.TaxRegistrationNumber2 === undefined) {
      this.obj.TaxRegistrationNumber2 = " - "
    }
    else {
      this.obj.TaxRegistrationNumber2 = myform.value.TaxRegistrationNumber2
    }
    if (myform.value.StartOfFiscalYear === "" || myform.value.StartOfFiscalYear === null || myform.value.StartOfFiscalYear === undefined) {
      this.obj.StartOfFiscalYear = 2018
    }
    else {
      this.obj.StartOfFiscalYear = myform.value.StartOfFiscalYear
    }
    if (myform.value.CostingMethod === "" || myform.value.CostingMethod === null || myform.value.CostingMethod === undefined) {
      this.obj.CostingMethod = " - "
    }
    else {
      this.obj.CostingMethod = myform.value.CostingMethod
    }
    if (myform.value.IsVat === "" || myform.value.IsVat === null || myform.value.IsVat === undefined) {
      this.obj.IsVat = true
    }
    else {
      this.obj.IsVat = myform.value.IsVat
    }
    if (myform.value.IsDelete === "" || myform.value.IsDelete === null || myform.value.IsDelete === undefined) {
      this.obj.IsDelete = false
    }
    else {
      this.obj.IsDelete = myform.value.IsDelete
    }
    if (myform.value.GroupOfCompanyID === "" || myform.value.GroupOfCompanyID === null || myform.value.GroupOfCompanyID === undefined) {
      this.obj.GroupOfCompanyID = 1
    }
    else {
      this.obj.GroupOfCompanyID = myform.value.GroupOfCompanyID
    }
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
    this._http.post(`${this.gloconfig.GetConnection("Companie", "DeleteAsync")}?id=${id}`, id)
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

