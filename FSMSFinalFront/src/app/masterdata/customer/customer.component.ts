import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Customer } from '../../model/Customer.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GlobalConfig } from '../../service/globalconfig.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
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
  selectedItem: Customer;
  holdvar: Customer[] = [];
  filterholder: Customer[];
  obj: Customer = new Customer();
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
    this.selectedItem = new Customer();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.myform = this.formBuilder.group({
      Id: [0],
      CustomerCode: ["", Validators.required],
      CustomerTitle: [""],
      CustomerName: ["", Validators.required],
      CustomerType: [""],
      ContactPersonName: [""],
      Gender: [""],
      Address1: [""],
      Address2: [""],
      Address3: [""],
      Email: [""],
      CreditLimit: [""],
      ChequeLimit: [""],
      Outstanding: [""],
      CustomerImage: [""],
      Remark: [""],
      IsSuspended: [""],
      IsBlackListed: [""],
      IsCreditAllowed: [""],
      IsActive: [""],
      GroupOfCompanyID: [""],
      CreatedUser: [""],
      CreatedDate: [""],
      ModifiedUser: [""],
      ModifiedDate: [""],
      DataTransfer: [""],
      TPno:[""]

    });
    this.Filter();
    this.switchData();
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
    this._http.get<Customer[]>(this.gloconfig.GetConnection("Customer", "GetAll"), { headers: this.customHeaders })
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
    console.log("this.selectedItem  ", this.selectedItem);
  }

  onSubmit(myform, event, btn) {
    this.obj.Id = myform.value.Id
    if (myform.value.CustomerCode === "" || myform.value.CustomerCode === null || myform.value.CustomerCode === undefined) {
      this.obj.CustomerCode = " - "
    }
    else {
      this.obj.CustomerCode = myform.value.CustomerCode
    }

    if (myform.value.CustomerTitle === "" || myform.value.CustomerTitle === null || myform.value.CustomerTitle === undefined) {
      this.obj.CustomerTitle = 1
    }
    else {
      this.obj.CustomerTitle = myform.value.CustomerTitle
    }

    if (myform.value.TPno === "" || myform.value.TPno === null || myform.value.TPno === undefined) {
      this.obj.TPno = ""
    }
    else {
      this.obj.TPno = myform.value.TPno
    }

    if (myform.value.CustomerName === "" || myform.value.CustomerName === null || myform.value.CustomerName === undefined) {
      this.obj.CustomerName = " - "
    }
    else {
      this.obj.CustomerName = myform.value.CustomerName
    }
    if (myform.value.CustomerType === "" || myform.value.CustomerType === null || myform.value.CustomerType === undefined) {
      this.obj.CustomerType = 1
    }
    else {
      this.obj.CustomerType = myform.value.CustomerType
    }
    if (myform.value.ContactPersonName === "" || myform.value.ContactPersonName === null || myform.value.ContactPersonName === undefined) {
      this.obj.ContactPersonName = " - "
    }
    else {
      this.obj.ContactPersonName = myform.value.ContactPersonName
    }
    if (myform.value.Gender === "" || myform.value.Gender === null || myform.value.Gender === undefined) {
      this.obj.Gender = 1
    }
    else {
      this.obj.Gender = myform.value.Gender
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
    if (myform.value.Email === "" || myform.value.Email === null || myform.value.Email === undefined) {
      this.obj.Email = " - "
    }
    else {
      this.obj.Email = myform.value.Email
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
    if (myform.value.CustomerImage === "" || myform.value.CustomerImage === null || myform.value.CustomerImage === undefined) {
      this.obj.CustomerImage = " - "
    }
    else {
      this.obj.CustomerImage = myform.value.CustomerImage
    }
    if (myform.value.Remark === "" || myform.value.Remark === null || myform.value.Remark === undefined) {
      this.obj.Remark = " - "
    }
    else {
      this.obj.Remark = myform.value.Remark
    }
    if (myform.value.IsSuspended === "" || myform.value.IsSuspended === null || myform.value.IsSuspended === undefined) {
      this.obj.IsSuspended = false
    }
    else {
      this.obj.IsSuspended = myform.value.IsSuspended
    }
    if (myform.value.IsBlackListed === "" || myform.value.IsBlackListed === null || myform.value.IsBlackListed === undefined) {
      this.obj.IsBlackListed = false
    }
    else {
      this.obj.IsBlackListed = myform.value.IsBlackListed
    }
    if (myform.value.IsCreditAllowed === "" || myform.value.IsCreditAllowed === null || myform.value.IsCreditAllowed === undefined) {
      this.obj.IsCreditAllowed = false
    }
    else {
      this.obj.IsCreditAllowed = myform.value.IsCreditAllowed
    }
    if (myform.value.IsActive === "" || myform.value.IsActive === null || myform.value.IsActive === undefined) {
      this.obj.IsActive = true
    }
    else {
      this.obj.IsActive = myform.value.IsActive
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
  Save(item: Customer) {
    console.log("Save Confirmed!", this.myform.valid);
    this._http.post(this.gloconfig.GetConnection("Customer", "SaveAsync"), item)
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
  Update(item: Customer) {
    this._http.post(this.gloconfig.GetConnection("Customer", "UpdateAsync"), item)
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
  deleteConfirm(item: Customer) {
    console.log("Deleting:-this.selectedItem  " + item.Id)
    this.Delete(item.Id);
  }
  deleteCancel() {
    console.log("User try to Delete. but cancelled");
  }

  Delete(id: number) {
    this._http.post(`${this.gloconfig.GetConnection("Customer", "DeleteAsync")}?id=${id}`, id)
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
