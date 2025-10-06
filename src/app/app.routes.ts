import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guard/auth.guard';
import { VegetableComponent } from './components/vegetable/vegetable.component';
import { FruitsComponent } from './components/fruits/fruits.component';
import { ItemsComponent } from './components/items/items.component';

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "about", component: AboutComponent,canActivate:[authGuard] },
  { path: "profile", component: ProfileComponent ,canActivate:[authGuard]},
  {
    path:'products',
    children:[
      {
      path :'vegetables' , component:VegetableComponent, canActivate:[authGuard]
      },
      {
        path :'fruits' , component:FruitsComponent , canActivate:[authGuard]
      },
      {
        path : 'items' ,
        component :ItemsComponent
      }
    ]
  },
  {
    path: "modules",
    children: [
      {
        path: "admin",
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      }
    ]
  },
  {
    path: "auth",
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
];
