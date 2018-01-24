import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../service/validation.service';

@Component({
  selector: 'control-messages',
  templateUrl: './field-error-display.component.html',
  styleUrls: ['./field-error-display.component.css']
})
export class FieldErrorDisplayComponent {
  // @Input() errorMsg: string;
  // @Input() displayError: boolean;
  @Input() control: FormControl;
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
      console.log("this.control.errors", this.control.errors);
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        console.log("this.control.errors.hasOwnProperty(propertyName)",this.control);
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}


