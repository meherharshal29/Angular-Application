import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/service/auth.service';
import { NgxLoadingModule } from 'ngx-loading'; // ✅ import

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    RouterModule,
    NgxLoadingModule
  ],
  templateUrl:'./cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  cartCount = 0;
  totalPrice = 0;
  isLoggedIn = false;
  loading = false; 

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.loadCart();
      } else {
        this.cartItems = [];
        this.cartCount = 0;
        this.totalPrice = 0;
        this.loading = false;
      }
    });
  }

  private loadCart(): void {
    this.loading = true; 
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.loading = false; 
      },
      error: () => (this.loading = false)
    });

    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  increaseQuantity(item: any): void {
    if (!this.isLoggedIn) {
      this.toastr.warning('Please log in to modify your cart', 'Warning');
      this.router.navigate(['/login']);
      return;
    }
    this.loading = true;
    item.quantityInCart++;
    this.cartService.updateQuantity(item.id, item.quantityInCart);
    this.calculateTotal();
    setTimeout(() => (this.loading = false), 1000);
  }

  decreaseQuantity(item: any): void {
    if (!this.isLoggedIn) {
      this.toastr.warning('Please log in to modify your cart', 'Warning');
      this.router.navigate(['/login']);
      return;
    }
    this.loading = true;
    if (item.quantityInCart > 1) {
      item.quantityInCart--;
      this.cartService.updateQuantity(item.id, item.quantityInCart);
      this.calculateTotal();
    } else {
      this.removeFromCart(item);
    }
    setTimeout(() => (this.loading = false), 1000);
  }

  removeFromCart(item: any): void {
    if (!this.isLoggedIn) {
      this.toastr.warning('Please log in to modify your cart', 'Warning');
      this.router.navigate(['/login']);
      return;
    }
    this.loading = true;
    this.cartService.removeFromCart(item.id);
    this.toastr.warning(`${item.name} removed from cart`, 'Success', {
      timeOut: 1000
    });
    setTimeout(() => (this.loading = false), 2000);
  }

clearCart(): void {
  if (!this.isLoggedIn) {
    this.toastr.warning('Please log in to clear your cart', 'Warning');
    this.router.navigate(['/login']);
    return;
  }

  this.loading = true; 
  setTimeout(() => {
    this.cartService.clearCart();
    this.toastr.warning('Cart cleared', 'Success');
    this.loading = false;
  }, 3000);
}

  proceedToCheckout(): void {
    if (!this.isLoggedIn) {
      this.toastr.warning('Please log in to proceed to checkout', 'Warning');
      this.router.navigate(['/login']);
      return;
    }
    this.toastr.info('Proceeding to checkout', 'Info');
    this.router.navigate(['/checkout']);
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantityInCart,
      0
    );
  }
}
