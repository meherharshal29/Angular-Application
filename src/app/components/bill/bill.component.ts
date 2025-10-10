import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../auth/service/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl:'./bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  cartItems: any[] = [];
  totalPrice = 0;
  deliveryCharge = 50;
  grandTotal = 0;
  isLoggedIn = false;
  loading = false;
  addressForm: FormGroup;
  paymentMethod: string = 'cod';
  showPaymentPopup = false;
  selectedPaymentType: string = '';
  private subscriptions = new Subscription();

  // Payment form for card
  cardForm: FormGroup;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      landmark: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      distance: [5, [Validators.required, Validators.min(1)]]
    });

    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardHolderName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = !!user;
        if (this.isLoggedIn) {
          this.loadCart();
          this.addressForm.patchValue({
            fullName: user?.fullName || '',
            email: user?.email || '',
          });
          this.calculateGrandTotal();
        } else {
          this.cartItems = [];
          this.totalPrice = 0;
          this.toastr.warning('Please log in to view your bill', 'Warning');
          this.router.navigate(['/auth/login']);
        }
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.add(
      this.cartService.getCartItems().subscribe({
        next: (items) => {
          this.cartItems = items;
          this.calculateTotal();
          this.calculateGrandTotal();
          this.cdr.detectChanges();
        },
        error: () => {
          this.toastr.error('Failed to load cart items', 'Error');
        }
      })
    );

    this.subscriptions.add(
      this.addressForm.get('distance')?.valueChanges.subscribe(distance => {
        this.calculateDeliveryCharge(distance);
        this.calculateGrandTotal();
      })
    );
  }

  private loadCart(): void {
    this.loading = true;
    this.spinner.show();
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.calculateGrandTotal();
        this.loading = false;
        this.spinner.hide();
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.spinner.hide();
        this.toastr.error('Failed to load cart items', 'Error');
      }
    });
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + (item.discountPrice || item.price || 0) * (item.quantityInCart || 1),
      0
    );
  }

  calculateDeliveryCharge(distance: number): void {
    if (distance <= 5) {
      this.deliveryCharge = 50;
    } else if (distance <= 10) {
      this.deliveryCharge = 100;
    } else {
      this.deliveryCharge = 150;
    }
  }

  calculateGrandTotal(): void {
    this.grandTotal = this.totalPrice + this.deliveryCharge;
  }

  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
    this.showPaymentPopup = false;
    
    if (method === 'upi') {
      this.showPaymentPopup = true;
      this.selectedPaymentType = 'upi';
    } else if (method === 'card') {
      this.showPaymentPopup = true;
      this.selectedPaymentType = 'card';
    }
  }

  openPaymentPopup(type: string): void {
  this.selectedPaymentType = type; 
  this.paymentMethod = type;      
  this.showPaymentPopup = true;
}


  closePaymentPopup(): void {
    this.showPaymentPopup = false;
    this.selectedPaymentType = '';
  }

  processPayment(): void {
    if (this.paymentMethod === 'card' && this.cardForm.invalid) {
      this.toastr.error('Please fill all card details correctly', 'Error');
      this.cardForm.markAllAsTouched();
      return;
    }

    this.placeOrder();
  }

  placeOrder(): void {
    if (!this.isLoggedIn) {
      this.toastr.warning('Please log in to place order', 'Warning');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.addressForm.invalid) {
      this.toastr.error('Please fill all required address fields', 'Error');
      this.addressForm.markAllAsTouched();
      return;
    }

    if (this.paymentMethod === 'card' && this.cardForm.invalid) {
      this.toastr.error('Please fill all card details correctly', 'Error');
      return;
    }

    this.loading = true;
    this.spinner.show();

    if (this.paymentMethod === 'cod') {
      this.toastr.success('Order placed successfully! Payment will be collected on delivery.', 'Success');
    } else if (this.paymentMethod === 'upi') {
      this.toastr.success('Please complete UPI payment using QR code. Order will be confirmed after payment.', 'Payment Pending');
    } else if (this.paymentMethod === 'card') {
      this.toastr.success('Card payment processed successfully!', 'Success');
    }

    setTimeout(() => {
      this.cartService.clearCart();
      this.router.navigate(['/']);
      this.loading = false;
      this.spinner.hide();
      this.closePaymentPopup();
      this.cdr.detectChanges();
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}