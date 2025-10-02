import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VegetablesRoutingModule } from './vegetables-routing.module';
import { MaterialModule } from '../../../shared/materials/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    VegetablesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ]
})
export class VegetablesModule { }
