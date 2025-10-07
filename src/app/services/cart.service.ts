import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/service/auth.service';

export interface Item {
  id: number;
  name: string;
  category: string;
  price: string;
  quantity: string;
  quantityUnit: string;
  discountPrice: string;
  shopName: string;
  imageUrl: string;
  details: string;
  additionalDetails: string;
  quantityInCart?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Item[] = [];
  private cartItemsSubject = new BehaviorSubject<Item[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  constructor(private authService: AuthService) {
    // Whenever login status changes, load the corresponding user's cart
    this.authService.currentUser$.subscribe(() => {
      this.loadCartItems();
    });

    this.loadCartItems(); 
  }

  // ✅ Load logged-in user's cart
  private loadCartItems(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && typeof window !== 'undefined') {
      const userEmail = currentUser.email;
      const userCartKey = `cartItems_${userEmail}`;
      const savedCart = localStorage.getItem(userCartKey);
      this.cartItems = savedCart ? JSON.parse(savedCart) : [];
    } else {
      this.cartItems = [];
    }

    this.cartItemsSubject.next(this.cartItems);
    this.cartCountSubject.next(this.cartItems.length);
  }

  // ✅ Add item for logged-in user only
  addToCart(item: Item): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('Please log in to add items to your cart.');
      return;
    }

    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (!existingItem) {
      this.cartItems.push({ ...item, quantityInCart: 1 });
    } else {
      existingItem.quantityInCart = (existingItem.quantityInCart || 1) + 1;
    }

    this.updateCart(currentUser.email);
  }

  getCartItems(): Observable<Item[]> {
    return this.cartItemsSubject.asObservable();
  }

  getCartCount(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  removeFromCart(itemId: number): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateCart(currentUser.email);
  }

  updateQuantity(itemId: number, quantity: number): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    if (item && quantity > 0) {
      item.quantityInCart = quantity;
      this.updateCart(currentUser.email);
    }
  }

  clearCart(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.cartItems = [];
    this.updateCart(currentUser.email);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + (price * (item.quantityInCart || 1));
    }, 0);
  }

  getItemQuantity(itemId: number): number {
    const foundItem = this.cartItems.find(item => item.id === itemId);
    return foundItem ? (foundItem.quantityInCart || 0) : 0;
  }

  // ✅ Save user-specific cart in localStorage
  private updateCart(email: string): void {
    const userCartKey = `cartItems_${email}`;
    localStorage.setItem(userCartKey, JSON.stringify(this.cartItems));
    this.cartItemsSubject.next(this.cartItems);
    this.cartCountSubject.next(this.cartItems.length);
  }
}
