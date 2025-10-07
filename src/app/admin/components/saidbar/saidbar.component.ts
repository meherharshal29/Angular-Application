import { Component, HostListener, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { MaterialModule } from '../../../shared/materials/material/material.module';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin/admin.service';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-saidbar',
  imports: [MaterialModule, RouterModule, CommonModule],
  templateUrl: './saidbar.component.html',
  styleUrls: ['./saidbar.component.scss']
})
export class SaidbarComponent implements AfterViewInit, OnInit, OnDestroy {
  isMobile: boolean = false;
  isLoggedIn: boolean = false;
  showSpinner: boolean = false;
  private loginSubscription!: Subscription;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(public adminS: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loginSubscription = this.adminS.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngAfterViewInit(): void {
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'currentAdmin') {
      this.adminS.checkLoginStatus(); 
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth < 768;
    }
  }

  closeMobileMenu() {
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
    }
  }
logout(): void {
  this.showSpinner = true; 
  this.closeMobileMenu();

  setTimeout(() => {
    this.adminS.logout();   
    this.showSpinner = false; 
    this.router.navigate(['/modules/admin/admin']); 
  }, 3000); 
}

}