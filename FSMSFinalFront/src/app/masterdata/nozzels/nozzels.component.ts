import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../service/validation.service';

@Component({
  selector: 'app-nozzels',
  templateUrl: './nozzels.component.html',
  styleUrls: ['./nozzels.component.css']
})
export class NozzelsComponent implements OnInit {
  userForm: any;
  
  constructor(private formBuilder: FormBuilder) {

    this.userForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'profile': ['']
    });

    console.log(this.userForm);
  }
  ngOnInit() {
  }

}
