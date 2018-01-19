import { Component, OnInit, AfterViewInit, ViewChild, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables'
import { HttpClient } from '@angular/common/http';
import { FuelType } from '../../model/fuelType.model';
import { delay } from 'q';
import * as Noty from 'noty';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, AfterViewInit {
 

  constructor(private _http: HttpClient) { }

  
  placements: string[] = ['top', 'left', 'right', 'bottom'];
  popoverTitle: string = 'Are you sure?';
  popoverMessage: string = 'Are you really <b>sure</b> you want to do this?';
  confirmText: string = 'Yes <i class="glyphicon glyphicon-ok"></i>';
  cancelText: string = 'No <i class="glyphicon glyphicon-remove"></i>';
  // confirmClicked: boolean = false;
  // cancelClicked: boolean = false;

  ngOnInit(): void {
   
  }
  ngAfterViewInit(): void {
    
  }

  confirmClicked(val:boolean){
    console.log("Clicked Confirm", val)
  }

  
  
}

