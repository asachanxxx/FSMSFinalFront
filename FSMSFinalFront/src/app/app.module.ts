import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { AppRoutingModule } from './app-routing.module';
import {RouterModule,Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ContentComponent } from './layout/content/content.component';
import { HomeComponent } from './home/home.component';
import { PumpsComponent } from './masterdata/pumps/pumps.component';
import { NozzelsComponent } from './masterdata/nozzels/nozzels.component';
import { EmployeesComponent } from './masterdata/employees/employees.component';
import { CustomerComponent } from './masterdata/customer/customer.component';
import { VehiclesComponent } from './masterdata/vehicles/vehicles.component';
import { RfcardsComponent } from './masterdata/rfcards/rfcards.component';
import { CompanyComponent } from './masterdata/company/company.component';
import { FueltypesComponent } from './masterdata/fueltypes/fueltypes.component';


import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    ContentComponent,
    HomeComponent,
    PumpsComponent,
    NozzelsComponent,
    EmployeesComponent,
    CustomerComponent,
    VehiclesComponent,
    RfcardsComponent,
    CompanyComponent,
    FueltypesComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    FormsModule,
    HttpClientModule
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
