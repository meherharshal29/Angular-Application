import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, User } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule, MaterialModule, MatProgressBarModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showProgress = false;
  progress = 0;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.showProgress = true;
      this.progress = 0;

      const { email, password } = this.loginForm.value;
      this.authService.login(email.toLowerCase(), password).subscribe({
        next: (success) => {
          if (success) {
            const interval = setInterval(() => {
              this.progress += 10;
              if (this.progress >= 100) {
                clearInterval(interval);
                this.showProgress = false;
                this.isLoading = false;
                this.spinner.show();
                this.toastr.success('Login successful! Redirecting...', 'Success', { timeOut: 2000 });
                setTimeout(() => {
                  this.spinner.hide();
                  this.router.navigate(['/']); // Redirect to dashboard
                }, 500);
              }
            }, 300);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.showProgress = false;
          this.toastr.error(error.message || 'Invalid email or password', 'Error');
        }
      });
    } else {
      this.toastr.error('Please fill in all fields correctly.', 'Error');
    }
  }
}