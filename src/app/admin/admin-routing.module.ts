import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

const routes: Routes = [
  {
    path:"admin",
    component :AdminLoginComponent
  },
  {
    path:"vegetable",
    loadChildren: () => import("./modules/vegetables/vegetables.module").then(m => m.VegetablesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
