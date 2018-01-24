import { Component } from '@angular/core';
import { GlobalConfig } from './service/globalconfig.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';


  constructor(private gloconfig:GlobalConfig){
    this.gloconfig.SetglobalConnection = "http://localhost:52904/";
    this.gloconfig.SetlogedInUserID = 1;
  }


}
