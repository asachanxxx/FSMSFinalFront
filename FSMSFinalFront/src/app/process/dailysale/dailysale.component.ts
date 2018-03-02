import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CreditSale } from '../../model/creditsale.model';
import { DailySalesHed } from '../../model/dailysaleshed.model';
import { GlobalConfig } from '../../service/globalconfig.service';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-dailysale',
  templateUrl: './dailysale.component.html',
  styleUrls: ['./dailysale.component.css']
})
export class DailysaleComponent implements OnInit ,AfterViewInit{

  filterholder: DailySalesHed[] =  new Array<DailySalesHed>();
  holdvar: DailySalesHed[] = [];
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
  //Variables for error and sucess messages
  issuccess = false;
  iserror = false;
  successmsg = "Inisizlising success message";
  errormsg = "Inisizlising success message";
  datefrom:Date;
  dateTo:Date;

  constructor(private gloconfig: GlobalConfig, private _http: HttpClient) { }

  ngOnInit() {
   console.log(this.holdvar);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: false
    };

  //this.GetFuelPRice(1);
   
    this.switchData();
  }


  showSuccess(message: string) {
    this.issuccess = true;
    this.iserror = false;
    this.successmsg = message;
    setTimeout(() => {
      this.issuccess = false;
      this.iserror = false;
    }, 5000);
  
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit", this.dtOptions);
    this.dtTrigger.next();
    //this.GetAllNozzels();
  }

  //************************************************************************** tswitchData ***************************************
  switchData(): void {
    this.holdvar = new Array<DailySalesHed>();
    //in first call on OnInit this.dtElement.dtInstance is not construct and check it for undefinned
    console.log("switchData ",this.dtElement)
    if (this.dtElement.dtInstance !== undefined) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        dtInstance.clear();
        // Switch
        this.holdvar = this.filterholder;
        console.log("switchData ", this.holdvar)
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }
  }

  GetFuelPRice(id: number) {
    console.log("this.datefrom , this.dateTo  " , this.datefrom , this.dateTo)
    let params = new HttpParams();
    params = params.append('toDate', '2018-02-13');
    params = params.append('fromDate', '2019-02-17');
    this._http.get<DailySalesHed[]>(`${this.gloconfig.GetConnection("CreditSale", "GetDailySales")}`,{params})
      .subscribe(
        data => {
          this.filterholder = data;
        
        },
        err => {
          console.log(err)
        },
        () => {
         this.holdvar = this.filterholder;
         console.log("GetFuelPRice", this.holdvar)
         this.switchData();
        });
  }

  SaveConfirm(item){
    this.GetFuelPRice(1);
  }

  onSubmit(myform,event,func){
    console.log(myform);
  }

  PrintConfirm(){
    
  }


}
