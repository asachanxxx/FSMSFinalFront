import { Component, Input, Output, EventEmitter, ElementRef, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import { SelectItem } from './select-item';
// import { stripTags } from './select-pipes';
// import { OptionsBehavior } from './select-interfaces';
// import { escapeRegexp } from './common';

@Component({
    selector: 'ng-select',
    styles: ["select-styles.css"],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        /* tslint:disable */
        useExisting: forwardRef(() => SelectComponent),
        /* tslint:enable */
        multi: true
      },
      {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => SelectComponent),
        multi: true,
      }
    ],
    templateUrl:"select-template.html"
})

export class SelectComponent implements OnInit, ControlValueAccessor {
    writeValue(obj: any): void {
        throw new Error("Method not implemented.");
    }
    registerOnChange(fn: any): void {
        throw new Error("Method not implemented.");
    }
    registerOnTouched(fn: any): void {
        throw new Error("Method not implemented.");
    }
    setDisabledState?(isDisabled: boolean): void {
        throw new Error("Method not implemented.");
    }
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
    
    
}