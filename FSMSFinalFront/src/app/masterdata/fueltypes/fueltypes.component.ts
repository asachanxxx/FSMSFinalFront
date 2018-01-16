import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fueltypes',
  templateUrl: './fueltypes.component.html',
  styleUrls: ['./fueltypes.component.css']
})
export class FueltypesComponent implements OnInit {

  ifNameEmpty:boolean = false;
  ifShortNameEmpty:boolean = false;
  ifPriceEmpty:boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
