import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef, Input, Output, AfterContentInit, ContentChild, ViewChildren } from '@angular/core';
import { Companie } from '../../model/company.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GlobalConfig } from '../../service/globalconfig.service';
import { HttpHeaders } from '@angular/common/http';
import { NgNoValidate } from '@angular/forms/src/directives/ng_no_validate_directive';
import { CreditSale, CreditSaleViewModel } from '../../model/creditsale.model';
import { Nozzle } from '../../model/Nozzle.model';
import { Customer } from '../../model/Customer.model';
import { Vehicle } from '../../model/Vehicle.model';
import { Employee } from '../../model/employee.model';

@Component({
  selector: 'app-creditsale',
  templateUrl: './creditsale.component.html',
  styleUrls: ['./creditsale.component.css']
})
export class CreditsaleComponent implements OnInit {
  incPumperid: any;
  incNozzelid: any;
  EmployeeObj: Employee[];
  EmployeeData: Employee[];
  DocNo: string = "0";
  incVehicle: any;
  incVehicleid: any;
  incCustomer: string;
  incCustomerid: any;
  @ViewChildren("t") vc;
  FuelPrice: number;
  NoOfUnits: number;
  Total: number;
  VehicleFinalObj: Vehicle[];
  VehicleData: Vehicle[];
  CustomerFinalObj: Customer[];
  CustomerData: Customer[];
  NozzelFinalObj: Nozzle[];
  NozzelData: Nozzle[];
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

  myform: FormGroup;
  selectedRow: any;
  selectedItem: CreditSale;
  holdvar: CreditSale[] = [];
  filterholder: CreditSale[];
  obj: CreditSale = new CreditSale();
  //Variables for error and sucess messages
  issuccess = false;
  iserror = false;
  successmsg = "Inisizlising success message";
  errormsg = "Inisizlising success message";


  salex: CreditSale = new CreditSale();

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
    this.selectedItem = new CreditSale();
  }

  onSubmit(myform, event, btn) {
    switch (btn) {
      case "Print":
        console.log("Print");
        break;
      case "Insert":
        console.log("Insert");
        break;
    }
  }

  SaveConfirm() {

    this.salex.CreatedDate = new Date();
    this.salex.CreatedUser = 1;
    this.salex.Customer = "";
    // this.salex.CustomerID =1
    this.salex.DataTransfer = 1;
    this.salex.Details = this.filterholder;
    this.salex.EmployeeId = 1;
    this.salex.Fueltype = "";
    this.salex.FuelTypeId = 1;
    this.salex.GroupOfCompanyID = 1;
    this.salex.Id = 1;
    this.salex.Isvalid = true;
    this.salex.ModifiedDate = new Date();
    this.salex.ModifiedUser = 1;
    this.salex.NoOfUnits = 1;
    //this.salex.NozzelId = 1;
    this.salex.PumpId = 1;
    this.salex.RecordDate = new Date();
    this.salex.RfID = 1;
    this.salex.RfIDCode = "123ddd";
    this.salex.ShiftId = 1;
    this.salex.Total = 0;
    this.salex.UnitPrice = 1;
    this.salex.Vehicle = "";
    // this.salex.VehicleID =1;
    console.log(this.salex);

      if (this.salex.Details.length > 0) {
        let hed: HttpHeaders = new HttpHeaders();
        this._http.post(this.gloconfig.GetConnection("CreditSale", "ProcessCreditSale"), this.filterholder)
          .subscribe(
            data => {
              console.log("Filter2", this.FuelPrice)
            },
            err => {
              console.log(err)
            },
            () => {
              //this.VehicleFinalObj = this.VehicleData;
              //this.switchData();
              window.alert("Record Saved!");
              this.clear()

            });
      } else {
        window.alert("Please add some item to save");
      }
  }

  clear() {
    this.filterholder = new Array<CreditSale>();
    //this.salex = new CreditSale();
  }

  ngOnInit() {
    this.FuelPrice = 0;
    this.Total = 0;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: false
    };
    this.myform = this.formBuilder.group({
      Id: [null],
      CompanyCode: ['', Validators.required],
      CompanyName: ['', Validators.required],
      OtherBusinessName1: [null],
    });

    this.filterholder = new Array<CreditSale>();
    this.switchData();
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit", this.dtOptions);
    this.dtTrigger.next();
    this.GetAllNozzels();
    this.GetAllCustomers();
    this.GetAllVehicles();
    this.GetDocNo(2001);
    this.GetAllPumpers();



  }
  //************************************************************************** tswitchData ***************************************
  switchData(): void {
    this.holdvar = new Array<CreditSale>();
    //in first call on OnInit this.dtElement.dtInstance is not construct and check it for undefinned
    if (this.dtElement.dtInstance !== undefined) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        dtInstance.clear();
        // Switch
        this.holdvar = this.filterholder;
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }
  }

  PrintConfirm() {

    var newWindow = window.open('https://www.sampathvishwa.com/SVRClientWeb/ActionController?sblparam=Z6spFdlqDbLImtIUQTtyQRr0n8kHqlCqHKiWIcYCXB9IRTX0I2pY6vbg1ypVn0LGpfgmxDsHN%2BRV%0D%0AH7E7RYZKktfGbh7Ub5Q5');
    console.log("PrintConfirm", newWindow);
  }

  cumilativeid: any = 0;

  AddItemToGrid() {
    console.log(this.incCustomer)
    if (this.incCustomer === undefined) {
      window.alert("Please a customer to continue");
      return;
    }

    if (this.incVehicle === undefined) {
      window.alert("Please a vehicle to continue");
      return;
    }

    if (this.FuelPrice === 0) {
      window.alert("Please select a nozzel to get fuel price");
      return;
    }

    if (this.Total === 0) {
      window.alert("Please select a nozzel to get fuel type and enter no of units to get Total");
      return;
    }

    this.cumilativeid += 1;
    let item: CreditSale = new CreditSale();
    item.Id = this.cumilativeid;
    item.Fueltype = "Patrol- " + this.cumilativeid;
    item.NoOfUnits = this.NoOfUnits;
    item.RecordDate = new Date();
    item.RfIDCode = "09937873";
    item.UnitPrice = this.FuelPrice;
    item.Total = this.Total;
    item.PumpId = this.incPumperid
    item.ShiftId = 1;
    item.EmployeeId = this.incPumperid // Pumper id
    item.CustomerID = this.incCustomerid;
    item.Customer = this.incCustomer;
    item.VehicleID = this.incVehicleid;
    item.Vehicle = this.incVehicle;

    this.switchData()
    this.filterholder.push(item);

  }


  OnChangePumper(val: any) {
    this.incPumperid = val.target.value;
  }

  OnChangeNozzel(val: any) {
    this.GetFuelPRice(val.target.value);
    this.vc.first.nativeElement.focus();
    this.incNozzelid = val.target.value;
  }
  OnChangeCustomer(val: any) {
    this.incCustomerid = val.target.value;
    this.incCustomer = val.target.options[val.target.selectedIndex].text;
  }
  OnChangeVehicle(val: any) {
    this.incVehicleid = val.target.value;
    this.incVehicle = val.target.options[val.target.selectedIndex].text;
  }

  noofunitKeyPRess(val: any) {
    if (val.charCode === 13) {
      console.log(val);
      console.log(val.target.value);
      if (val.target.value === "") {
        window.alert("Please enter valied no for no of units");
        return;
      }
      this.Total = this.FuelPrice * this.NoOfUnits;
      console.log("this.Total", this.Total);
    }

  }

  deleteConfirm(item: CreditSale) {
    const index: number = this.filterholder.indexOf(item);
    if (index !== -1) {
      this.filterholder.splice(index, 1);
      console.log("ON Delete  ", this.filterholder);
      this.switchData()
    }
  }

  setClickedRow(item, i) {
    //console.log(item);
  }

  GetAllNozzels() {
    let hed: HttpHeaders = new HttpHeaders();
    this._http.get<Nozzle[]>(this.gloconfig.GetConnection("Nozzle", "GetAll"))
      .subscribe(
        data => {
          this.NozzelData = data;
          console.log("GetAllNozzels ", data)
        },
        err => {
          console.log(err)
        },
        () => {
          this.NozzelFinalObj = this.NozzelData;
          //this.switchData();

        });
  }

  GetAllCustomers() {
    let hed: HttpHeaders = new HttpHeaders();
    this._http.get<Customer[]>(this.gloconfig.GetConnection("Customer", "GetAll"))
      .subscribe(
        data => {
          this.CustomerData = data;
          console.log("GetAllCustomers ", data)
        },
        err => {
          console.log(err)
        },
        () => {
          this.CustomerFinalObj = this.CustomerData;
          //this.switchData();

        });
  }

  GetAllVehicles() {
    let hed: HttpHeaders = new HttpHeaders();
    this._http.get<Vehicle[]>(this.gloconfig.GetConnection("Vehicle", "GetAll"))
      .subscribe(
        data => {
          this.VehicleData = data;
          console.log("GetAllVehicles ", data)
        },
        err => {
          console.log(err)
        },
        () => {
          this.VehicleFinalObj = this.VehicleData;
          //this.switchData();

        });
  }

  GetAllPumpers() {
    let hed: HttpHeaders = new HttpHeaders();
    this._http.get<Employee[]>(this.gloconfig.GetConnection("Employee", "GetAll"))
      .subscribe(
        data => {
          this.EmployeeData = data;
          console.log("GetAllPumpers", data)
        },
        err => {
          console.log(err)
        },
        () => {
          this.EmployeeObj = this.EmployeeData;
        });
  }


  GetFuelPRice(id: number) {
    let hed: HttpHeaders = new HttpHeaders();
    this._http.get<number>(`${this.gloconfig.GetConnection("Nozzle", "GetFuelPrice")}?Nozzelid=${id}`)
      .subscribe(
        data => {
          this.FuelPrice = data;
          console.log("GetFuelPRice", this.FuelPrice)
        },
        err => {
          console.log(err)
        },
        () => {
          //this.VehicleFinalObj = this.VehicleData;
          //this.switchData();
        });
  }
  GetDocNo(id: number) {
    let hed: HttpHeaders = new HttpHeaders();
    this._http.get<string>(`${this.gloconfig.GetConnection("Helper", "GetDocumentNumber")}?docno=${id}`)
      .subscribe(
        data => {
          this.DocNo = data;
          console.log("GetDocNo ", this.DocNo)
        },
        err => {
          console.log(err)
        },
        () => {
          //this.VehicleFinalObj = this.VehicleData;
          //this.switchData();
        });
  }







}
