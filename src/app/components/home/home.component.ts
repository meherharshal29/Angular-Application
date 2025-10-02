// home.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatError } from '@angular/material/input';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule,FormsModule,ReactiveFormsModule,CommonModule,MatError],
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  newsletterForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.newsletterForm.valid) {
      // Handle subscription logic here
      console.log('Subscribed:', this.newsletterForm.value.email);
    }
  }
}