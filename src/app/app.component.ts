import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { NavbarComponent } from "./common/navbar/navbar.component";
import { SaidbarComponent } from './admin/components/saidbar/saidbar.component';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter } from 'rxjs';
import { MaterialModule } from "./shared/materials/material/material.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule, SaidbarComponent, MaterialModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showSidebar = false;
  showNavbar = true;

  constructor(private router: Router, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    // Show/hide navbar & sidebar based on URL
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((event: any) => {
      const url = event.url;
      if (url.includes('modules/admin/login')) {
        this.showNavbar = false;
        this.showSidebar = false;
      } else if (url.startsWith('/modules/admin')) {
        this.showNavbar = false;
        this.showSidebar = true;
      } else {
        this.showNavbar = true;
        this.showSidebar = false;
      }
    });
  }

  // Show spinner for 3s before logout
  logout() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      localStorage.removeItem('currentUser'); // or call authService.logout()
      this.router.navigate(['/auth/login']);
    }, 3000);
  }
}
