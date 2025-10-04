import { Component, HostListener, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/materials/material/material.module';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin/admin.service';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-saidbar',
  imports: [MaterialModule, RouterModule, CommonModule],
  templateUrl: './saidbar.component.html',
  styleUrls: ['./saidbar.component.scss']
})
export class SaidbarComponent implements AfterViewInit, OnInit {
  isMobile: boolean = false;
  isLoggedIn: boolean = false;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(public adminS: AdminService) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  ngAfterViewInit(): void {
    this.checkScreenSize();
  }

  // Listen for login/logout changes in localStorage
  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.key === 'currentUser') {
      this.checkLoginStatus();
    }
  }

  private checkLoginStatus(): void {
    if (typeof window !== 'undefined') {
      this.isLoggedIn = !!localStorage.getItem('currentUser');
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
}
