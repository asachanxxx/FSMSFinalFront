import { Component, OnInit } from '@angular/core';
import { GlobalConfig } from '../service/globalconfig.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private gloconfig:GlobalConfig) { }

  ngOnInit() {
    this.gloconfig.SetglobalConnection = "http://localhost:52904/";
    this.gloconfig.SetlogedInUserID = 1;
  }

}
