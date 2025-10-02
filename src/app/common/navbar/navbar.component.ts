// navbar.component.ts
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MaterialModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  currentUser: User | null = null;
  private sub: Subscription = new Subscription();
  cartItemCount = 0;

  constructor(private authService: AuthService, private router: Router, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngAfterViewInit(): void {
    // Optional: Additional initialization if needed
  }

  closeMobileMenu(event?: Event): void {
    if (window.innerWidth < 992) {
      const navbarCollapse = document.getElementById('navbarSupportedContent');
      if (navbarCollapse) {
        const bsCollapse = new (window as any).bootstrap.Collapse(navbarCollapse, { toggle: false });
        bsCollapse.hide();
      }
      if (event) {
        (event.target as HTMLElement).blur(); 
      }
    }
  }

  getIconBgClass(): string {
    return this.currentUser ? 'bg-green' : 'bg-red';
  }

  logout(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }, 3000);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}