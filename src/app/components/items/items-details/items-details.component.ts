import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsAddService } from '../../../admin/services/items/items-add.service';
import { CartService } from '../../../services/cart.service';
import { MaterialModule } from '../../../shared/materials/material/material.module';
import { CommonModule, NgIfContext } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-items-details',
  imports: [MaterialModule, CommonModule],
  templateUrl: './items-details.component.html',
  styleUrls: ['./items-details.component.scss']
})
export class ItemsDetailsComponent implements OnInit {
  item: any = null;
  isLoading = true;
  fallbackImage = 'https://rkmrajahmundry.org/wp-content/uploads/2020/04/default-placeholder.png'; 
  loading?: TemplateRef<NgIfContext<any>> | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemsAddService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.loadItem(+itemId);
    } else {
      this.toastr.error('Invalid item ID', 'Error');
      this.isLoading = false;
    }
  }

  loadItem(id: number): void {
    this.itemService.getItemById(id).subscribe({
      next: (item) => {
        this.item = {
          ...item,
          imageUrl: item.imageUrl || null,
        };
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load item details', 'Error', { timeOut: 3000 });
        this.isLoading = false;
        this.router.navigate(['/items']);
      },
    });
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  calculateDiscount(item: any): number {
    if (item.price && item.discountPrice) {
      const price = parseFloat(item.price);
      const discountPrice = parseFloat(item.discountPrice);
      return Math.round(((discountPrice - price) / discountPrice) * 100);
    }
    return 0;
  }

  addToCart(item: any): void {
    this.cartService.addToCart(item);
    this.toastr.success(`${item.name} added to cart!`, 'Success');
    this.router.navigate(['/cart']);

  }

  buyNow(item: any): void {
    this.cartService.addToCart(item);
    this.router.navigate(['/cart']);
    this.toastr.info(`Proceeding to buy ${item.name}`, 'Info');
  }

  goBack(): void {
    this.router.navigate(['/products/items']);
  }
}