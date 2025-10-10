// home.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatError } from '@angular/material/input';
import { AdminRoutingModule } from "../../admin/admin-routing.module";
import { c } from "../../../../node_modules/@angular/cdk/a11y-module.d-DBHGyKoh";
import { NgxLoadingModule } from 'ngx-loading';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule, MatError, AdminRoutingModule,NgxLoadingModule],
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  newsletterForm!: FormGroup;
  loading:boolean = false;

  constructor(private router: Router,private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
loaderConfig = {
  animationType: 'fading-circle',
  backdropBackgroundColour: 'rgba(0, 0, 0, 0.5)',
  backdropBorderRadius: '0px',
  primaryColour: '#4caf50',
  secondaryColour: '#8bc34a',
  tertiaryColour: '#c8e6c9',
  fullScreenBackdrop: true, 
};

goToProducts(category: string) {
  this.loading = true;

  setTimeout(() => {
    this.router.navigate(['/products', category]).finally(() => {
      this.loading = false;
    });
  }, 500); 
}

    

  onSubmit() {
    if (this.newsletterForm.valid) {
      // Handle subscription logic here
      console.log('Subscribed:', this.newsletterForm.value.email);
    }
  }
}