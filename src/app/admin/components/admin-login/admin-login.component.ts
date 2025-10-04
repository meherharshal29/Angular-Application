import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/materials/material/material.module';

interface RegisterUser {
  email: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loginError: string = '';
  isLoading: boolean = false;  // Show progress bar
  progress: number = 0;        // Progress value
  showProgress: boolean = false;
  showPassword: boolean = false; 

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminService.addDefaultAdmin();
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.loginError = 'Please enter both email and password.';
      this.toastr.error(this.loginError, 'Login Failed');
      return;
    }

    this.isLoading = true;
    this.showProgress = true;
    this.progress = 0;

    // Increment progress 0 → 100
    const interval = setInterval(() => {
      this.progress += 10;
      if (this.progress >= 100) {
        clearInterval(interval);
        this.checkLogin();
      }
    }, 300); // 200ms per 10% → 3 seconds total
  }

  private checkLogin(): void {
    const users: RegisterUser[] = JSON.parse(localStorage.getItem('users') || '[]');
    const adminUser = users.find(user => 
      user.email === this.email && 
      user.password === this.password && 
      user.role === 'admin'
    );

    if (adminUser) {
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      this.loginError = '';
      this.toastr.success('Admin login successful!', 'Welcome Admin');

      this.router.navigate(['/modules/admin/mainpanel/dashboard']);
    } else {
      this.loginError = 'Invalid email or password.';
      this.toastr.error(this.loginError, 'Login Failed');
    }

    this.isLoading = false;
    this.showProgress = false;
    this.progress = 0;
  }
}
