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
  filterholder: FuelType[];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  // The trigger needed to re-render the table
  dtTrigger: Subject<any> = new Subject();
  segments: number[];
  // Object that contains the "segments" data
  data: FuelType[];
  // Variable used to display in the datatable
  persons: FuelType[];

  isload: boolean = false;

  constructor(private _http: HttpClient) { }

  ngOnInit(): void {
    this.segments = [1, 2, 3];
      this.dtOptions = {
        pagingType: 'full_numbers'
      };
      this.GetData();
      this.switchData();
      console.log("ngOnInit", this.persons);
  }
  ngAfterViewInit(): void {
    console.log("ngAfterViewInit", this.persons);
    this.dtTrigger.next();
  }

  GetData() {
    this._http.get<FuelType[]>("https://localhost:44382/FuelTypesDapper/GetAll", { observe: 'response' })
      .subscribe(
      data2 => {
        this.data = data2.body;
      },
      err => {
        console.log(err)
      },
      () => {
        this.persons = this.data;
        console.log("this.persons", this.persons);
      }
    );

  }
  switchData(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Switch
      this.persons = this.data; //this.data[id];
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  showmessage(message:string){
    console.log("Show Message");
    new Noty({
      text: message

    }).show();
  }
}

