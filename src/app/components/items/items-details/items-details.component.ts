import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsAddService } from '../../../admin/services/items/items-add.service';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../shared/materials/material/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemsComponent } from '../items.component';

@Component({
  selector: 'app-items-details',
  standalone: true,
  imports: [MaterialModule, FormsModule, CommonModule,ItemsComponent],
  templateUrl: './items-details.component.html',
  styleUrls: ['./items-details.component.scss']
})
export class ItemsDetailsComponent implements OnInit {
  item: any = null;
  isLoading = true;
  fallbackImage = 'https://rkmrajahmundry.org/wp-content/uploads/2020/04/default-placeholder.png'; 

  feedbackText: string = '';
  feedbackRating: number | null = null;
  feedbacks: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemsAddService,
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //view details
    this.route.paramMap.subscribe(params => {
      const itemId = params.get('id');
      if (itemId) {
        this.isLoading = true;
        this.loadItem(+itemId);
      } else {
        this.toastr.error('Invalid item ID', 'Error');
        this.isLoading = false;
      }
    });
  }

loadItem(id: number): void {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  this.itemService.getItemById(id).subscribe({
    next: (item) => {
      this.item = { ...item, imageUrl: item.imageUrl || null };
      this.isLoading = false;
      this.loadFeedbacks(id);
    },
    error: () => {
      this.toastr.error('Failed to load item details', 'Error');
      this.isLoading = false;
      this.router.navigate(['/products/items']);
    }
  });
}

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  calculateDiscount(item: any): number {
    const originalPrice = parseFloat(item.price);
    const discountedPrice = parseFloat(item.discountPrice);
    if (originalPrice && discountedPrice && originalPrice > discountedPrice) {
      return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    }
    return 0;
  }

  addToCart(item: any) {
    this.cartService.addToCart(item);
    this.toastr.success(`${item.name} added to cart!`, 'Success');
    this.router.navigate(['/cart']);
  }

  buyNow(item: any) {
    this.cartService.addToCart(item);
    this.router.navigate(['/cart']);
    this.toastr.info(`Proceeding to buy ${item.name}`, 'Info');
  }

  goBack() {
    this.router.navigate(['/products/items']);
  }

  submitFeedback() {
    if (!this.feedbackText || !this.feedbackRating) {
      this.toastr.error('Please enter feedback and rating', 'Error');
      return;
    }
    const feedback = {
      user: 'Guest',
      comment: this.feedbackText,
      rating: this.feedbackRating
    };
    this.feedbacks.unshift(feedback); 
    this.feedbackText = '';
    this.feedbackRating = null;
    this.toastr.success('Feedback submitted!', 'Success');
  }

  loadFeedbacks(itemId: number) {
    this.feedbacks = []; 
  }

  viewDetails(itemId: number) {
    this.router.navigate(['/products/items', itemId]);
  }
}
