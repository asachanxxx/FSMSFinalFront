import { BrowserModule  } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
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
import {FieldErrorDisplayComponent} from './validators/app-field-error-display';

import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { GlobalConfig } from './service/globalconfig.service';
import { CreditsaleComponent } from './process/creditsale/creditsale.component';
import { DailysaleComponent } from './process/dailysale/dailysale.component';



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
    FieldErrorDisplayComponent,
    CreditsaleComponent,
    DailysaleComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
   
    BrowserAnimationsModule
    
  ],
  providers: [GlobalConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
