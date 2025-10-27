import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { AuthService, User } from '../../auth/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''] // optional: only if user wants to change password
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user) {
          this.profileForm.patchValue({
            fullName: user.fullName || '',
            email: user.email
          });
        } 
        // else {
        //   this.toastr.warning('Please log in to view your profile', 'Warning');
        // }
      },
      error: (err) => this.toastr.error(err.message || 'Failed to load user data')
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.currentUser) {
      this.profileForm.patchValue({
        fullName: this.currentUser.fullName,
        email: this.currentUser.email
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.toastr.error('Please fill in all fields correctly', 'Error');
      return;
    }

    if (!this.currentUser) {
      this.toastr.warning('You must be logged in to update profile', 'Warning');
      return;
    }

    this.isLoading = true;

    const updatedUser: User = {
      fullName: this.profileForm.value.fullName,
      email: this.profileForm.value.email
    };

    // Include password only if user enters it
    if (this.profileForm.value.password) {
    }

    this.authService.updateUser(updatedUser).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.isEditing = false;
          this.toastr.success('Profile updated successfully', 'Success');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(err.message || 'Failed to update profile', 'Error');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.toastr.info('Logged out successfully', 'Info');
  }
}
