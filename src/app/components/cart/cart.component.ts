import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule,RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  cartCount = 0;
  totalPrice = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  increaseQuantity(item: any): void {
    item.quantityInCart++;
    this.cartService.updateQuantity(item.id, item.quantityInCart);
    this.calculateTotal();
  }

  decreaseQuantity(item: any): void {
    if (item.quantityInCart > 1) {
      item.quantityInCart--;
      this.cartService.updateQuantity(item.id, item.quantityInCart);
      this.calculateTotal();
    } else {
      this.removeFromCart(item);
    }
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantityInCart,
      0
    );
  }

  removeFromCart(item: any): void {
    this.cartService.removeFromCart(item.id);
    this.toastr.warning(`${item.name} removed from cart`, 'Success',{
      timeOut:1000
    });
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.toastr.warning('Cart cleared', 'Success');
  }

  proceedToCheckout(): void {
    this.toastr.info('Proceeding to checkout', 'Info');
    this.router.navigate(['/checkout']);
  }
}
