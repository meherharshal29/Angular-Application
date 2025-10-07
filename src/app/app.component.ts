import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { NavbarComponent } from './common/navbar/navbar.component';
import { SaidbarComponent } from './admin/components/saidbar/saidbar.component';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter, Subscription } from 'rxjs';
import { MaterialModule } from './shared/materials/material/material.module';
import { DialogPopupComponent } from './components/dialog-popup/dialog-popup.component';
import { AdminService } from './admin/services/admin/admin.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule, SaidbarComponent, MaterialModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  showSidebar = false;
  showNavbar = true;
  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private adminS: AdminService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url;

      // Scroll to top smoothly on every route change (SSR-safe)
      if (isPlatformBrowser(this.platformId)) {
        // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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

    if (isPlatformBrowser(this.platformId)) {
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
        }, 3000); 
      }, 5000); 
    }
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.spinner.show();
    if (this.router.url.startsWith('/modules/admin')) {
      this.adminS.logout(); 
    } else {
      localStorage.removeItem('currentUser'); 
      this.router.navigate(['/auth/login']);
    }
    this.spinner.hide(); 
  }
}