import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { ViewItemsComponent } from './view-items/view-items.component';

const routes: Routes = [
  {
    path :"add",
    component :AddComponent
  },
  {
    path:'view-item',
    component:ViewItemsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VegetablesRoutingModule { }
