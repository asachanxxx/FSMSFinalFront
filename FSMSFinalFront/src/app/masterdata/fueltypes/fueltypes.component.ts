import { Component, OnInit } from '@angular/core';
import { FuelType } from '../../model/fuelType.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-fueltypes',
  templateUrl: './fueltypes.component.html',
  styleUrls: ['./fueltypes.component.css']
})
export class FueltypesComponent implements OnInit {

  ifNameEmpty:boolean = false;
  ifShortNameEmpty:boolean = false;
  ifPriceEmpty:boolean = false;

  dtTrigger: Subject<any> = new Subject();
  holdvar: FuelType[] = [];
  dtOptions: DataTables.Settings = {};

  constructor(private _http:HttpClient) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };

    this.Filter();
  }

  Filter() {
    this._http.get<FuelType[]>("https://localhost:44382/FuelTypesDapper/GetAll", {observe: 'response'})
      .subscribe(
         data =>{
       
            this.holdvar = data.body;
           console.log("this.holdvar" , this.holdvar)
           this.dtTrigger.next();
         } ,
         err=>{
           console.log(err)
         },
         ()=>{
           console.log("Finish")
         }
      );
    
  }


}
