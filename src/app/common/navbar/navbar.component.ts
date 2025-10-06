import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../auth/service/auth.service';
import { CartService } from '../../services/cart.service'; // Import CartService
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
  isLoggingOut = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService, // Add CartService
    private router: Router,
    private spinner: NgxSpinnerService,
    private notificationS: NotificationService
  ) {}

  ngOnInit(): void {
    // Subscribe to user authentication status
    this.sub.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );

    // Subscribe to cart count updates
    this.sub.add(
      this.cartService.getCartCount().subscribe(count => {
        this.cartItemCount = count;
      })
    );
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
    this.isLoggingOut = true;
    this.spinner.show();

    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      this.notificationS.showNotification('Logged out successfully!', 'success');
      this.spinner.hide();
      this.isLoggingOut = false;
    }, 3000);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}