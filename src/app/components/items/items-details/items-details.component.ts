import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsAddService } from '../../../admin/services/items/items-add.service';
import { CartService } from '../../../services/cart.service';
import { FeedbackService, Feedback } from '../../../services/feedback.service';
import { AuthService } from '../../../auth/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../shared/materials/material/material.module';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgxLoadingModule } from 'ngx-loading';
import { WordLimitPipe } from '../../../pipe/word-limit-pipe.pipe';
import { AdminRoutingModule } from '../../../admin/admin-routing.module';

@Component({
  selector: 'app-items-details',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule, NgxLoadingModule, AdminRoutingModule],
  templateUrl: './items-details.component.html',
  styleUrls: ['./items-details.component.scss']
})
export class ItemsDetailsComponent implements OnInit {
  items: any[] = [];
  item: any = null;
  isNgxLoading = false;
  isLoading = false;
  isLoggedIn = false;
  currentUser: any = null;
  feedbacks: Feedback[] = [];
  feedbackForm: FormGroup;
  fallbackImage = 'https://media.istockphoto.com/id/2173059563/vector/coming-soon-image-on-white-background-no-photo-available.jpg?s=612x612&w=0&k=20&c=v0a_B58wPFNDPULSiw_BmPyhSNCyrP_d17i2BPPyDTk=';
    showFullDetails = false;
     showAllFeedbacks = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemsAddService,
    private cartService: CartService,
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.feedbackForm = this.fb.group({
      rating: [null, Validators.required],
      feedbackText: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUser = this.authService.getCurrentUser();
    }

    this.route.paramMap.subscribe(params => {
      const itemId = params.get('id');
      if (itemId) {
        this.isNgxLoading = true;
        this.loadItem(+itemId);
        this.loadItems();
      } else {
        this.toastr.error('Invalid item ID', 'Error');
      }
    });
  }

    toggleDetails() {
      this.showFullDetails = !this.showFullDetails;
    }

// Toggle function
toggleAllFeedbacks() {
  this.showAllFeedbacks = !this.showAllFeedbacks;
}
  loadItem(id: number): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.itemService.getItemById(id).subscribe({
      next: (data) => {
        this.item = { ...data, imageUrl: data.imageUrl || this.fallbackImage };
        this.isNgxLoading = false;
        this.loadFeedbacks(id);
      },
      error: () => {
        this.isNgxLoading = false;
        this.toastr.error('Failed to load item details', 'Error');
        this.router.navigate(['/products/items']);
      }
    });
  }

  loadItems(): void {
    this.itemService.getItems().subscribe({
      next: (data) => {
        this.items = data.map(i => ({ ...i, imageUrl: i.imageUrl || this.fallbackImage }));
      },
      error: () => this.toastr.error('Failed to load items', 'Error', { timeOut: 3000 })
    });
  }

  loadFeedbacks(itemId: number): void {
    this.feedbackService.getFeedbacksByItemId(itemId.toString()).subscribe({
      next: (data) => {
        this.feedbacks = data.map(f => ({
          ...f,
          fullName: f.fullName || 'Anonymous',
          createdAt: new Date(f.createdAt),
          showFullText: false 

        }));
      },
      error: () => this.toastr.error('Failed to load feedbacks', 'Error')
    });
  }

  setRating(star: number): void {
    this.feedbackForm.patchValue({ rating: star });
  }

  submitFeedback(): void {
    if (!this.isLoggedIn) {
      this.toastr.error('Please log in to submit feedback', 'Error');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.feedbackForm.invalid) {
      this.toastr.error('Please provide a rating', 'Error');
      return;
    }

    this.isLoading = true;

    const feedback: Feedback = {
      itemId: this.item.id.toString(),
      fullName: this.currentUser?.fullName || 'Anonymous', 
      email: this.currentUser?.email || 'guest@example.com',
      rating: this.feedbackForm.get('rating')?.value,
      feedbackText: this.feedbackForm.get('feedbackText')?.value,
      createdAt: new Date().toISOString()
    };

    this.feedbackService.submitFeedback(feedback).subscribe({
      next: (response) => {
        this.feedbacks.unshift({
          ...response,
          fullName: response.fullName || 'Anonymous',
          createdAt: new Date(response.createdAt)
        });
        this.feedbackForm.reset();
        this.isLoading = false;
        this.toastr.success('Feedback submitted!', 'Success');
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to submit feedback', 'Error');
      }
    });
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  calculateDiscount(item: any): number {
    const original = parseFloat(item.price);
    const discount = parseFloat(item.discountPrice);
    if (original && discount && original > discount) {
      return Math.round(((original - discount) / original) * 100);
    }
    return 0;
  }

  addToCart(item: any): void {
    this.cartService.addToCart(item);
    this.toastr.success(`${item.name} added to cart!`, 'Success');
  }

  viewDetails(itemId: number): void {
    this.isNgxLoading = true;
    setTimeout(() => {
      this.router.navigate(['/products/items', itemId]);
      this.isNgxLoading = false;
    }, 500);
  }

  goBack(): void {
    this.router.navigate(['/products/items']);
  }
}