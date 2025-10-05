import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { NavbarComponent } from "./common/navbar/navbar.component";
import { SaidbarComponent } from './admin/components/saidbar/saidbar.component';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { MaterialModule } from "./shared/materials/material/material.module";
import { DialogPopupComponent } from './components/dialog-popup/dialog-popup.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule, SaidbarComponent, MaterialModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showSidebar = false;
  showNavbar = true;

  constructor(
    private router: Router, 
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Show/hide navbar & sidebar based on URL
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((event: any) => {
      const url = event.url;
      
      // Scroll to top smoothly on every route change (SSR-safe)
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }

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

    setTimeout(() => {
      const dialogRef = this.dialog.open(DialogPopupComponent, {
        width: '400px',
        data: { message: 'Shop Organic Vegetables and Fruits' }, 
        disableClose: false, 
        autoFocus: true,
        panelClass: 'custom-dialog' 
      });

      setTimeout(() => {
        dialogRef.close();
      }, 5000);
    }, 5000);
  }

  logout() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      localStorage.removeItem('currentUser'); 
      this.router.navigate(['/auth/login']);
    }, 3000);
  }
}