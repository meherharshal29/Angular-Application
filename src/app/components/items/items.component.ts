import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { ItemsAddService } from '../../admin/services/items/items-add.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  items: any[] = [];
  isLoading = true;

  constructor(
    private itemService: ItemsAddService,
    private toastr: ToastrService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  viewDetails(itemId: number): void {
    this.router.navigate(['/products/items', itemId]);
  }

  loadItems(): void {
    this.itemService.getItems().subscribe({
      next: (data) => {
        this.items = data.map(item => ({
          ...item,
          imageUrl: item.imageUrl
        }));
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load items', 'Error', { timeOut: 3000 });
        this.isLoading = false;
      }
    });
  }

  addToCart(item: any): void {
    this.cartService.addToCart(item);
    this.toastr.success(`${item.name} added to cart!`, 'Success', { timeOut: 1000 });
  }

  getItemQuantity(itemId: number): number {
    return this.cartService.getItemQuantity(itemId);
  }

  // --- New functions for increment/decrement ---
  increaseQuantity(item: any): void {
    const currentQty = this.getItemQuantity(item.id) || 0;
    this.cartService.updateQuantity(item.id, currentQty + 1);
  }

  decreaseQuantity(item: any): void {
    const currentQty = this.getItemQuantity(item.id) || 0;
    if (currentQty > 0) {
      this.cartService.updateQuantity(item.id, currentQty - 1);
    }
  }
}
