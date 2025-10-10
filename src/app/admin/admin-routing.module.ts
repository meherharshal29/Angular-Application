import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { adminGuard } from '../guard/admin.guard';
import { RegisterUserComponent } from './components/register-user/register-user.component';

const routes: Routes = [
  {
    path:"admin",
    component :AdminLoginComponent
  },
  {
    path:'mainpanel',
    canActivate:[adminGuard],
    children:[
       {
        path:'dashboard',
        component:AdminDashboardComponent
       },
       {
        path:'register-user',
        component:RegisterUserComponent
       }
    ]
  },
  {
    path:"vegetable",
    loadChildren: () => import("./modules/vegetables/vegetables.module").then(m => m.VegetablesModule),
    canActivate:[adminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
