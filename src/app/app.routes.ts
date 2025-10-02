import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "about", component: AboutComponent,canActivate:[authGuard] },
  { path: "profile", component: ProfileComponent ,canActivate:[authGuard]},

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
