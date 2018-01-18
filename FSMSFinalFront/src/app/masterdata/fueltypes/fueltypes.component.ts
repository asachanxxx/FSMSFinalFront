import { Component, OnInit } from '@angular/core';
import { FuelType } from '../../model/fuelType.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalConfig } from '../../service/globalconfig.service';

@Component({
  selector: 'app-fueltypes',
  templateUrl: './fueltypes.component.html',
  styleUrls: ['./fueltypes.component.css']
})
export class FueltypesComponent implements OnInit {

  myform: FormGroup;
  selectedItem: FuelType;
  updatingItem: FuelType;
  ifNameEmpty: boolean = false;
  ifShortNameEmpty: boolean = false;
  ifPriceEmpty: boolean = false;
  selectedRow: any;
  dtTrigger: Subject<any> = new Subject();
  holdvar: FuelType[] = [];
  dtOptions: DataTables.Settings = {};

  constructor(private _http: HttpClient, private gloconfig: GlobalConfig) { }

  ngOnInit() {
   
    this.selectedItem = new FuelType();
    

    this.myform = new FormGroup({
      'Id': new FormControl(),
      'FuelFullName': new FormControl(null, Validators.required),
      'FuelShortName': new FormControl(null, [Validators.required, Validators.minLength(15)]),
      'UnitPrice': new FormControl(),
    });

    console.log("calling on init: this.holdvar - ", this.holdvar);
    this.Filter();
    
  }

  setClickedRow(item: any, i: any) {
    this.selectedRow = i;
    this.selectedItem = item;
  }

 

  onSubmit(content, myform, event, btn) {
    console.log("Submitted:- content ", content)
    console.log("Submitted:- myform ", myform.value)
    console.log("Submitted:- event ", event)
    console.log("Submitted:- event ", btn)

    let obj: FuelType = new FuelType();
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
    }
    )
  }

   filterholder:FuelType[];

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
        console.log("Finish")
        this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 10,
          destroy:true
        };
        this.holdvar = this.filterholder;
        console.log("this.holdvar", this.holdvar)
        this.dtTrigger.next();
      }
      );

  }

  delete(item: FuelType) {
    console.log("Deleting:-this.selectedItem  " + item.Id)
  }


}
