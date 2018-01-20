import { Component, OnInit,ViewChild, AfterViewInit } from '@angular/core';
import { FuelType } from '../../model/fuelType.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables'
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalConfig } from '../../service/globalconfig.service';

@Component({
  selector: 'app-fueltypes',
  templateUrl: './fueltypes.component.html',
  styleUrls: ['./fueltypes.component.css']
})
export class FueltypesComponent implements OnInit ,AfterViewInit{
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  placements: string[] = ['top', 'left', 'right', 'bottom'];
  popoverTitle: string = 'Are you sure?';
  popoverMessage: string = 'Are you really <b>sure</b> you want to do this?';
  confirmText: string = 'Yes <i class="glyphicon glyphicon-ok"></i>';
  cancelText: string = 'No <i class="glyphicon glyphicon-remove"></i>';
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;

  myform: FormGroup;
  selectedItem: FuelType;
  updatingItem: FuelType;
  ifNameEmpty: boolean = false;
  ifShortNameEmpty: boolean = false;
  ifPriceEmpty: boolean = false;
  selectedRow: any;
  dtTrigger: Subject<any> = new Subject();
  holdvar: FuelType[] = [];
  filterholder: FuelType[];
  dtOptions: DataTables.Settings = {};

  constructor(private _http: HttpClient, private gloconfig: GlobalConfig) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.selectedItem = new FuelType();
    this.myform = new FormGroup({
      'Id': new FormControl(),
      'FuelFullName': new FormControl(null, Validators.required),
      'FuelShortName': new FormControl(null, [Validators.required, Validators.minLength(15)]),
      'UnitPrice': new FormControl(),
    });
    console.log("calling on init: this.holdvar - ", this.holdvar);
    this.Filter();
    this.switchData();
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit", this.holdvar);
    this.dtTrigger.next();
  }

  Filter() {
    this._http.get<FuelType[]>("https://localhost:44382/FuelTypesDapper/GetAll", { observe: 'response' })
      .subscribe(
      data => {
        this.filterholder = data.body;
      },
      err => {
        console.log(err)
      },
      () => {
        this.holdvar = this.filterholder;
        console.log("Finish" ,this.holdvar)
      }
      );
  }

  switchData(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Switch
      this.holdvar = this.filterholder; //this.data[id];
      console.log("switchData" ,this.holdvar)
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  setClickedRow(item: any, i: any) {
    this.selectedRow = i;
    this.selectedItem = item;
  }
  onSubmit(myform, event, btn) {
    //console.log("Submitted:- content ", content)
    console.log("Submitted:- myform ", myform.value)
    console.log("Submitted:- event ", event)
    console.log("Submitted:- event ", btn)

    let obj: FuelType = new FuelType();
    obj.Id = myform.value.Id
    obj.FuelFullName = myform.value.FuelFullName
    obj.FuelShortName = myform.value.FuelShortName
    obj.UnitPrice = myform.value.UnitPrice
    obj.CreatedDate = new Date();
    obj.ModifiedDate = new Date();
    obj.CreatedUser = this.gloconfig.GetlogedInUserID;
    obj.ModifiedUser = this.gloconfig.GetlogedInUserID
    obj.DataTransfer = 1;
    obj.GroupOfCompanyID = 1;

    switch (btn) {
      case 'Insert':
        obj.Id = -1;
        this.Save(obj);
        break;
      case 'Update':
        this.Update(obj);
        break;
      default: break;
    }
  }


  Save(item: FuelType) {
    this._http.post("https://localhost:44382/FuelTypesDapper/SaveAsync", item)
      .subscribe(
      data => {
        console.log(data)
      },
      err => {
        console.log(err)
      },
      () => {
        console.log("Finish")
        this.Filter();
        this.switchData();
      }
      )
  }

  Update(item: FuelType) {
    this._http.post("https://localhost:44382/FuelTypesDapper/UpdateAsync", item)
      .subscribe(
      data => {
        console.log(data)
      },
      err => {

        console.log(err)
      },
      () => {
        console.log("Finish")
        this.Filter();
        this.switchData();
      }
      )
  }

 
  delete(item: FuelType) {
    console.log("Deleting:-this.selectedItem  " + item.Id)
  }


}
