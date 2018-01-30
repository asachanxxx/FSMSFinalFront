import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../service/validation.service';
import { VehiclesComponent } from '../vehicles/vehicles.component';

@Component({
  selector: 'app-nozzels',
  templateUrl: './nozzels.component.html',
  styleUrls: ['./nozzels.component.css']
})
export class NozzelsComponent implements OnInit {
  userForm: any;
  
  @ViewChild(VehiclesComponent) nc: VehiclesComponent;

  constructor(private formBuilder: FormBuilder) {

    this.userForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'profile': ['']
    });

    console.log("nc :-" , this.nc);
  }
  ngOnInit() {

  }

}
