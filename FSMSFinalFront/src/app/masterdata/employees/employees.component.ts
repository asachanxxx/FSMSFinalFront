
import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GlobalConfig } from '../../service/globalconfig.service';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    throw new Error("Method not implemented.");
  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

 

    }
