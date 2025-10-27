import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService, User } from '../../auth/service/auth.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';

declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MaterialModule,
    FormsModule,
    NgxLoadingModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  cartItemCount = 0;
  cartItems: any[] = [];
  totalPrice = 0;
  isLoggedIn = false;
  loading = false;
  isLoggingOut = false;

  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Watch login user
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = !!user;
        if (this.isLoggedIn) {
          this.loadCart();
        } else {
          this.cartItems = [];
          this.cartItemCount = 0;
          this.totalPrice = 0;
        }
        this.cdr.detectChanges();
      })
    );

    

    // Watch cart count
    this.subscriptions.add(
      this.cartService.getCartCount().subscribe(count => {
        this.cartItemCount = count;
        this.cdr.detectChanges();
      })
    );

    // Watch cart items
    this.subscriptions.add(
      this.cartService.getCartItems().subscribe({
        next: (items) => {
          this.cartItems = items;
          this.calculateTotal();
          this.cdr.detectChanges();
        },
        error: () => {
          this.toastr.error('Failed to load cart items', 'Error');
        }
      })
    );
  }
      closeOffcanvasAndNavigate(): void {
          const offcanvasEl = document.getElementById('cartOffcanvas');
          if (offcanvasEl) {
            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
            offcanvas.hide();
          }
          this.router.navigateByUrl(this.router.url);
        }

        
  /** Open offcanvas cart **/
  openCartOffcanvas(): void {
    if (!this.isLoggedIn) {
      this.toastr.warning('Please log in to view your cart', 'Warning');
      this.router.navigate(['/auth/login']);
      return;
    }
    const offcanvasEl = document.getElementById('cartOffcanvas');
    if (offcanvasEl) {
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);
      offcanvas.show();
    }
  }

  /** Load cart items **/
  private loadCart(): void {
    this.loading = true;
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load cart items', 'Error');
      }
    });
  }

  /** Remove item **/
  removeFromCart(item: any): void {
    this.cartService.removeFromCart(item.id);
    this.toastr.warning(`${item.name} removed from cart`, 'Removed');
    this.calculateTotal();
  }

  /** Clear cart **/
  clearCart(): void {
    this.cartService.clearCart();
    this.toastr.info('Cart cleared', 'Info');
    this.calculateTotal();
  }

  /** Increase quantity **/
  increaseQuantity(item: any): void {
    item.quantityInCart++;
    this.cartService.updateQuantity(item.id, item.quantityInCart);
    this.calculateTotal();
  }

  /** Decrease quantity **/
  decreaseQuantity(item: any): void {
    if (item.quantityInCart > 1) {
      item.quantityInCart--;
      this.cartService.updateQuantity(item.id, item.quantityInCart);
    } else {
      this.removeFromCart(item);
    }
    this.calculateTotal();
  }

  /** Calculate total **/
  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + (item.discountPrice || 0) * (item.quantityInCart || 1),
      0
    );
  }

  /** Proceed to checkout **/
  proceedToCheckout(): void {
    const offcanvasEl = document.getElementById('cartOffcanvas');
    if (offcanvasEl) {
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      offcanvas?.hide();
    }
    this.router.navigate(['/bill']);
  }

  /** Close mobile menu **/
  closeMobileMenu(event?: Event): void {
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    if (navbarCollapse?.classList.contains('show')) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
      bsCollapse.hide();
    }
    if (event) (event.target as HTMLElement)?.blur();
  }

  /** Icon background color **/
  getIconBgClass(): string {
    return this.currentUser ? 'bg-success text-white' : 'bg-danger text-white';
  }

  /** Logout **/
  logout(): void {
    this.isLoggingOut = true;
    this.spinner.show();
    this.authService.logout();
    this.router.navigate(['/auth/login']).then(() => {
      this.notificationService.showNotification('Logged out successfully!', 'success');
      this.spinner.hide();
      this.isLoggingOut = false;
      this.cdr.detectChanges();
    }).catch(() => {
      this.notificationService.showNotification('Logout failed. Try again.', 'error');
      this.spinner.hide();
      this.isLoggingOut = false;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
