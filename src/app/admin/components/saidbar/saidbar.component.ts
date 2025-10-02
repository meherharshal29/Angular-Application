import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/materials/material/material.module';
import { RouterModule } from '@angular/router';

@Component({
  standalone:true,
  selector: 'app-saidbar',
  imports: [MaterialModule, RouterModule],
  templateUrl: './saidbar.component.html',
  styleUrl: './saidbar.component.scss'
})
export class SaidbarComponent {

}
