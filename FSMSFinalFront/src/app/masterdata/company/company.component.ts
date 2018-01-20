import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/filter'
import {Observable} from 'rxjs';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor(private httpClient:HttpClient) { }

  ngOnInit() {

    let beers = [
      {name: "Stella", country: "Belgium", price: 9.50},
      {name: "Sam Adams", country: "USA", price: 8.50},
      {name: "Bud Light", country: "USA", price: 6.50},
      {name: "Brooklyn Lager", country: "USA", price: 8.00},
      {name: "Sapporo", country: "Japan", price: 7.50}
  ];
   
  Observable.from(beers)   // <1>
    .filter(beer => beer.price < 8)   // <2>
    .map(beer => beer.name + ": $" + beer.price) // <3>
    .subscribe(    // <4>
        beer => console.log(beer),
        err => console.error(err),
        () => console.log("Streaming is over")
  );

  }

  public popoverTitle: string = 'Popover title';
  public popoverMessage: string = 'Popover description';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;


  onSubmit(event){
    console.log(event)
  
  }

  cancel(val:boolean){
    console.log(val);
  }
  confirm(status:boolean,val2:any){
    console.log(status, val2);

  
  }
  API_URL = ""
  getCustomerList(_archid): void {
    this.httpClient.get<ICustomer[]>(this.API_URL)
      // .filter(data=>data.filter(x=>x.cat_type) ==_archid )
      .subscribe(data => {
        data.filter(x=>x.cat_type == _archid)
      },
      (error: HttpErrorResponse) => {
        console.log (error.name + ' ' + error.message);
      });
  }




}

interface ICustomer{
  id:number;
  cat_type:string;
  CustomerName:string;
}

class  beers {
  name: string;
  country: string;
  price: number;
}
