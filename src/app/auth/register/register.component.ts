import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { Observable } from 'rxjs';
import { ProgressBarService } from '../../services/progess-bar.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,RouterModule,MaterialModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  cShowPassword = false;
  showProgress$!: Observable<boolean>;
  progress$!: Observable<number>;


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private progressService: ProgressBarService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  ngOnInit() {
    this.showProgress$ = this.progressService.showProgress$;
    this.progress$ = this.progressService.progress$;
  }

  togglePasswordVisibility() {
    this.showPassword =!this.showPassword;
  }  
  togglePasswordVisibility1() {
    this.cShowPassword =!this.cShowPassword;
  }
  passwordMatch(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

 onSubmit(): void {
  if (this.registerForm.valid && !this.isLoading) {
    this.isLoading = true;

    this.progressService.simulateProgress(() => {
      const { fullName, email, password } = this.registerForm.value;
      return Promise.resolve(this.authService.register({ fullName, email: email.toLowerCase(), password }));
    }).then((success) => {
      if (success) {
        this.toastr.success('Registration successful!', 'Success');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      } else {
        this.toastr.error('Email already exists', 'Error');
      }
      this.isLoading = false;
    });
  } else {
    this.toastr.error('Please fill in all fields correctly.', 'Error');
  }
}
}