import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from "@angular/material/button";
import { MaterialModule } from '../../../shared/materials/material/material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface RegisterUser {
  email: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [MaterialModule,CommonModule,ReactiveFormsModule],
  templateUrl:'./admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: RegisterUser | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentUserStr = localStorage.getItem('currentAdmin');
    if (currentUserStr) {
      try {
        this.currentUser = JSON.parse(currentUserStr);
        if (!this.currentUser || this.currentUser.role !== 'admin') {
          this.logout();
        }
      } catch (e) {
        this.logout();
      }
    } else {
      this.router.navigate(['/admin']);
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/modules/admin/admin']);
  }
}