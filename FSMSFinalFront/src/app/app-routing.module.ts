import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PumpsComponent } from './masterdata/pumps/pumps.component';
import { NozzelsComponent } from './masterdata/nozzels/nozzels.component';
import { EmployeesComponent } from './masterdata/employees/employees.component';
import { CustomerComponent } from './masterdata/customer/customer.component';
import { VehiclesComponent } from './masterdata/vehicles/vehicles.component';
import { RfcardsComponent } from './masterdata/rfcards/rfcards.component';
import { CompanyComponent } from './masterdata/company/company.component';
import { FueltypesComponent } from './masterdata/fueltypes/fueltypes.component';

const routes: Routes = [
  {path:'' ,component:HomeComponent},
  {path:'home',component:HomeComponent},
  {path:'company',component:CompanyComponent},
  {path:'pump',component:PumpsComponent},
  {path:'nozzel',component:NozzelsComponent},
  {path:'employee',component:EmployeesComponent},
  {path:'customer',component:CustomerComponent},
  {path:'vehicle',component:VehiclesComponent},
  {path:'rfcard',component:RfcardsComponent},
  {path:'fueltypes',component:FueltypesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
