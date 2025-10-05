import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';  
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    MatProgressBarModule,
  ],
  templateUrl:'./login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showProgress = false;
  progress = 0;

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
  showPassword: boolean = false;

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }

  async onSubmit(): Promise<void> {  // Made async for potential future HTTP calls
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      
      try {
        // If authService.login() is async (e.g., HTTP), await it here:
        // const success = await this.authService.login(email.toLowerCase(), password);
        const success = this.authService.login(email.toLowerCase(), password);  // Current sync version

        if (success) {
          this.showProgress = true;
          this.progress = 0;

          const interval = setInterval(() => {
            this.progress += 10;

            if (this.progress >= 100) {
              clearInterval(interval);
              this.showProgress = false;
              this.isLoading = false;
              this.spinner.show();
              this.toastr.success('Login successful! Redirecting...', 'Success', { timeOut: 2000 });

              setTimeout(() => {
                this.router.navigate(['/']);
                this.spinner.hide();
              }, 500); 
            }
          }, 300); 
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (error) {
        this.toastr.error('Invalid email or password', 'Error');
      } finally {
        this.isLoading = false;  
      }
    }
  }

}