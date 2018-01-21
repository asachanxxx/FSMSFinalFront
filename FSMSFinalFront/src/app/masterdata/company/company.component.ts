import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/filter'
import {Observable} from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, AfterViewInit {
  
  
  ngAfterViewInit(): void {
    
  }
 

  constructor(private httpClient:HttpClient,private formBuilder: FormBuilder) { }

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


  this.form = this.formBuilder.group({
    name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    address: this.formBuilder.group({
      street: [null, Validators.required],
      street2: [null],
      zipCode: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      country: [null, Validators.required]
    })
  });



  }

  public popoverTitle: string = 'Popover title';
  public popoverMessage: string = 'Popover description';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;


  // onSubmit(event){
  //   console.log(event)
  
  // }

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



////////////////////////////////////////////////////////////////////////////////////////////////////////

form: FormGroup;

isFieldValid(field: string) {
  return !this.form.get(field).valid && this.form.get(field).touched;
}

displayFieldCss(field: string) {
  return {
    'has-error': this.isFieldValid(field),
    'has-feedback': this.isFieldValid(field)
  };
}

onSubmit() {
  console.log(this.form);
  if (this.form.valid) {
    console.log('form submitted');
  } else {
    this.validateAllFormFields(this.form);
  }
}

validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    console.log(field);
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      this.validateAllFormFields(control);
    }
  });
}

reset(){
  this.form.reset();
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

