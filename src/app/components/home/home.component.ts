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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule, MatError, AdminRoutingModule,],
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  newsletterForm!: FormGroup;

  constructor(private router: Router,private fb: FormBuilder) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
    goToFruitsProducts(category: string) {
        this.router.navigate(['/products', category]);
   }
      goToVegetablesProducts(category: string) {
        this.router.navigate(['/products', category]);
   }

  onSubmit() {
    if (this.newsletterForm.valid) {
      // Handle subscription logic here
      console.log('Subscribed:', this.newsletterForm.value.email);
    }
  }
}