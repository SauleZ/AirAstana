import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PassengerDetailsComponent} from './passenger-details.component';

const routes: Routes = [
  {
    path: '',
    component: PassengerDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassengerDetailsRoutingModule { }
