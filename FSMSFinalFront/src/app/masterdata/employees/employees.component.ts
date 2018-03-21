import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { Customer } from '../../model/Customer.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GlobalConfig } from '../../service/globalconfig.service';
import { HttpHeaders } from '@angular/common/http';
import { Employee } from '../../model/employee.model';



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
	selectedItem: Employee;
	holdvar: Employee[] = [];
	filterholder: Employee[];
	obj: Employee = new Employee();
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
		this.selectedItem = new Employee();
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
      Id: [0],
			EmployeeCode: [""],
			EmployeeName: [""],
			Telephone: [""],
			Mobile: [""],
			IsActive: [""],
			CreditLimit: [""],
			CashInHand: [""],
			LocationID: [""],
			GroupOfCompanyID: [""],
			CreatedUser: [""],
			CreatedDate: [""],
			ModifiedUser: [""],
			ModifiedDate: [""],
			DataTransfer: [""],
			CompanyId: [""],
			Passcode: [""],
			BasicMonthlySalary: [""],
			HorlyRate: [""],
		});
		this.Filter();
		this.switchData();
		this.showSuccess("Program Inisialized");
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
		if (myform.value.EmployeeCode === "" || myform.value.EmployeeCode === null || myform.value.EmployeeCode === undefined) {
			this.obj.EmployeeCode = " - "
		}
		else {
			this.obj.EmployeeCode = myform.value.EmployeeCode
		}
		if (myform.value.EmployeeName === "" || myform.value.EmployeeName === null || myform.value.EmployeeName === undefined) {
			this.obj.EmployeeName = " - "
		}
		else {
			this.obj.EmployeeName = myform.value.EmployeeName
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
		if (myform.value.IsActive === "" || myform.value.IsActive === null || myform.value.IsActive === undefined) {
			this.obj.IsActive = true
		}
		else {
			this.obj.IsActive = myform.value.IsActive
		}
		if (myform.value.CreditLimit === "" || myform.value.CreditLimit === null || myform.value.CreditLimit === undefined) {
			this.obj.CreditLimit = 0.00;
		}
		else {
			this.obj.CreditLimit = myform.value.CreditLimit
		}
		if (myform.value.CashInHand === "" || myform.value.CashInHand === null || myform.value.CashInHand === undefined) {
			this.obj.CashInHand = 0.00;
		}
		else {
			this.obj.CashInHand = myform.value.CashInHand
		}
		if (myform.value.LocationID === "" || myform.value.LocationID === null || myform.value.LocationID === undefined) {
			this.obj.LocationID = 0.00;
		}
		else {
			this.obj.LocationID = myform.value.LocationID
		}
    this.obj.GroupOfCompanyID = 1
		this.obj.CreatedUser = this.gloconfig.GetlogedInUserID;
		this.obj.CreatedDate = new Date();
		this.obj.ModifiedUser = this.gloconfig.GetlogedInUserID
		this.obj.ModifiedDate = new Date();
		this.obj.DataTransfer = 1;
		if (myform.value.CompanyId === "" || myform.value.CompanyId === null || myform.value.CompanyId === undefined) {
			this.obj.CompanyId = 1
		}
		else {
			this.obj.CompanyId = myform.value.CompanyId
		}
		if (myform.value.Passcode === "" || myform.value.Passcode === null || myform.value.Passcode === undefined) {
			this.obj.Passcode = " - "
		}
		else {
			this.obj.Passcode = myform.value.Passcode
		}
		if (myform.value.BasicMonthlySalary === "" || myform.value.BasicMonthlySalary === null || myform.value.BasicMonthlySalary === undefined) {
			this.obj.BasicMonthlySalary = 0;
		}
		else {
			this.obj.BasicMonthlySalary = myform.value.BasicMonthlySalary
		}
		if (myform.value.HorlyRate === "" || myform.value.HorlyRate === null || myform.value.HorlyRate === undefined) {
			this.obj.HorlyRate = 0;
		}
		else {
			this.obj.HorlyRate = myform.value.HorlyRate
		}
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
	Update(item: Employee) {
		this._http.post(this.gloconfig.GetConnection("Employee", "UpdateAsync"), item)
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
	deleteConfirm(item: Employee) {
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
