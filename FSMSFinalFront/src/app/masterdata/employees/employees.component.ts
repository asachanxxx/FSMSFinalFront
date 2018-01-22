
import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Employee } from '../../model/fuelType.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GlobalConfig } from '../../service/globalconfig.service';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit, AfterViewInit {

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
  selectedItem: FuelType;
  holdvar: FuelType[] = [];
  filterholder: FuelType[];
  obj: FuelType = new FuelType();
  //Variables for error and sucess messages
  issuccess = false;
  iserror = false;
  successmsg = "Inisizlising success message";
  errormsg = "Inisizlising success message";

  constructor(private _http: HttpClient, private gloconfig: GlobalConfig,
    private formBuilder: FormBuilder) { }

  showSuccess(message: string) {
    this.issuccess = true;
    this.iserror = false;
    this.successmsg = message;
    setTimeout(() => {
      this.issuccess = false;
      this.iserror = false;
    }, 5000);
    this.selectedItem = new FuelType();
  }

  showError(message: string) {
    this.errormsg = message
    this.issuccess = false;
    this.iserror = true;
    setTimeout(() => {
      this.issuccess = false;
      this.iserror = false;
    }, 5000);

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
    ngOnInit() {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
      };
      this.myform = this.formBuilder.group({
        Id: [null],
        FuelFullName: [null, Validators.required],
        FuelShortName: [null, [Validators.required, Validators.maxLength(10)]],
        UnitPrice: [null, Validators.required],
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
      Filter() {
        let hed: HttpHeaders = new HttpHeaders();
        this._http.get<Employee[]>(this.gloconfig.GetConnection("Employee", "GetAll"), { headers: this.customHeaders })
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
      switchData(): void {
        //in first call on OnInit this.dtElement.dtInstance is not construct and check it for undefinned
        if(this.dtElement.dtInstance !== undefined) {
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
      setClickedRow(item: any, i: any) {
        this.selectedRow = i;
        this.selectedItem = item;
      }
      onSubmit(myform, event, btn) {
        this.obj.Id = myform.value.Id
        this.obj.EmployeeCode = myform.value.EmployeeCode
        this.obj.EmployeeName = myform.value.EmployeeName
        this.obj.Telephone = myform.value.Telephone
        this.obj.Mobile = myform.value.Mobile
        this.obj.IsActive = myform.value.IsActive
        this.obj.CreditLimit = myform.value.CreditLimit
        this.obj.CashInHand = myform.value.CashInHand
        this.obj.LocationID = myform.value.LocationID
        this.obj.GroupOfCompanyID = myform.value.GroupOfCompanyID
        this.obj.CreatedUser = this.gloconfig.GetlogedInUserID;
        this.obj.CreatedDate = new Date();
        this.obj.ModifiedUser = this.gloconfig.GetlogedInUserID
        this.obj.ModifiedDate = new Date();
        this.obj.DataTransfer = 1;
        this.obj.CompanyId = myform.value.CompanyId
        this.obj.Passcode = myform.value.Passcode
        this.obj.BasicMonthlySalary = myform.value.BasicMonthlySalary
        this.obj.HorlyRate = myform.value.HorlyRate
        switch (btn) {
          case 'Insert':
            console.log("On Submit - case insert : ", btn)
            this.obj.Id = -1;
            break;
          default: break;
        }
      }
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
      Save(item: Employee) {
        console.log("Save Confirmed!", this.myform.valid);
        this._http.post(this.gloconfig.GetConnection("Employee", "SaveAsync"), item)
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
      UpdateCancel()
      {
        console.log("User try to update. but cancelled");
      }
      Update(item: Employee)
      {
        this._http.post(this.gloconfig.GetConnection(Employee, "UpdateAsync"), item)
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
      deleteConfirm(item: FuelType) {
        console.log("Deleting:-this.selectedItem  " + item.Id)
        this.Delete(item.Id);
      }
      deleteCancel() {
        console.log("User try to Delete. but cancelled");
      }

      Delete(id: number) {
        this._http.post(this.gloconfig.GetConnection("Employee", "DeleteAsync") + `?id =${id}`, id)
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
