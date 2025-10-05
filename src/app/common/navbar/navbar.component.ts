import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, MaterialModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private sub: Subscription = new Subscription();
  cartItemCount = 0;
  isLoggingOut = false; // ✅ flag for spinner overlay + blur

  constructor(
    private authService: AuthService, 
    private router: Router,
    private spinner: NgxSpinnerService,
    private notificationS: NotificationService
  ) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
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
    this.isLoggingOut = true;   // show overlay + blur
    this.spinner.show();         // show spinner

    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      this.notificationS.showNotification('Logged out successfully!', 'success');

      this.spinner.hide();       // hide spinner
      this.isLoggingOut = false; // hide overlay
    }, 3000);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
