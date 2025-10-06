import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  constructor() {
    // Only access localStorage if window exists
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
        this.cartItemsSubject.next(this.cartItems);
        this.cartCountSubject.next(this.cartItems.length);
      }
    }
  }

  addToCart(item: Item): void {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (!existingItem) {
      this.cartItems.push({ ...item, quantityInCart: 1 });
    } else {
      existingItem.quantityInCart = (existingItem.quantityInCart || 1) + 1;
    }
    this.updateCart();
  }

  getCartItems(): Observable<Item[]> {
    return this.cartItemsSubject.asObservable();
  }

  getCartCount(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  removeFromCart(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateCart();
  }

  updateQuantity(itemId: number, quantity: number): void {
    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    if (item && quantity > 0) {
      item.quantityInCart = quantity;
      this.updateCart();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + (price * (item.quantityInCart || 1));
    }, 0);
  }

  getCartSnapshot(): Item[] {
    return this.cartItems;
  }

  getItemQuantity(itemId: number): number {
    const foundItem = this.cartItems.find(item => item.id === itemId);
    return foundItem ? (foundItem.quantityInCart || 0) : 0;
  }

  private updateCart(): void {
    this.cartItemsSubject.next(this.cartItems);
    this.cartCountSubject.next(this.cartItems.length);

    // Only store in localStorage if window exists
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  }
}
