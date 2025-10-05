import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/materials/material/material.module';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loginError: string = '';
  isLoading: boolean = false;
  progress: number = 0;
  showProgress: boolean = false;
  showPassword: boolean = false;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ensure default admin exists
    this.adminService['addDefaultAdmin']?.();
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

    // Fake progress bar (loading effect)
    const interval = setInterval(() => {
      this.progress += 10;
      if (this.progress >= 100) {
        clearInterval(interval);
        this.checkLogin();
      }
    }, 300);
  }

  private checkLogin(): void {
    const success = this.adminService.login(this.email, this.password);

    if (success) {
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
