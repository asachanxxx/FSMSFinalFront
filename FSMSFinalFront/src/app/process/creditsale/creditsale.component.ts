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
import { CreditSale, CreditSaleViewModel } from '../../model/creditsale.model';
import { Nozzle } from '../../model/Nozzle.model';
@Component({
  selector: 'app-creditsale',
  templateUrl: './creditsale.component.html',
  styleUrls: ['./creditsale.component.css']
})
export class CreditsaleComponent implements OnInit {
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
  selectedItem: CreditSaleViewModel;
  holdvar: CreditSaleViewModel[] = [];
  filterholder: CreditSaleViewModel[];
  obj: CreditSaleViewModel = new CreditSaleViewModel();
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
    this.selectedItem = new CreditSaleViewModel();
  }

  onSubmit(myform, event, btn) {
    switch (btn) {
      case "Print":
        console.log("Print");
        break;
    }
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave:false
    };
    this.myform = this.formBuilder.group({
      Id: [null],
      CompanyCode: ['', Validators.required],
      CompanyName: ['', Validators.required],
      OtherBusinessName1: [null],
    });
    this.filterholder = new Array<CreditSaleViewModel>();
    this.switchData();
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit", this.dtOptions);
    this.dtTrigger.next();
    this.GetAllNozzels();

  }
  //************************************************************************** tswitchData ***************************************
  switchData(): void {
    this.holdvar = new Array<CreditSaleViewModel>();
    //in first call on OnInit this.dtElement.dtInstance is not construct and check it for undefinned
    if (this.dtElement.dtInstance !== undefined) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        dtInstance.clear();
        // console.log("AddItemToGrid",this.filterholder)
        // console.log("holdvar",this.holdvar)
    
        // Switch
        
        this.holdvar = this.filterholder; //this.data[id];
        
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
    this.cumilativeid += 1;
    let item: CreditSaleViewModel = new CreditSaleViewModel();
    item.Id = this.cumilativeid;
    item.Fueltype = "Patrol- " + this.cumilativeid;
    item.NoOfUnits = 100;
    item.RecordDate = new Date();
    item.RfIDCode = "09937873";
    item.UnitPrice = 117;
    item.Total = item.NoOfUnits * item.UnitPrice

    this.switchData()
    this.filterholder.push(item);
    
    // console.log("AddItemToGrid",this.filterholder)
    // console.log("holdvar",this.holdvar)
  }


  deleteConfirm(item: CreditSaleViewModel) {
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
        console.log("Filter2", data)
      },
      err => {
        console.log(err)
      },
      () => {
        this.NozzelFinalObj = this.NozzelData;
        //this.switchData();

      });
  }

}
