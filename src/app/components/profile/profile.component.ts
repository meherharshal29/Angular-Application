import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService, User } from '../../auth/service/auth.service';

interface Item {
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userForm!: FormGroup;
  itemForm!: FormGroup;
  settingsForm!: FormGroup;
  currentUser: User | null = null;
  items: Item[] = [];
  dataSource = new MatTableDataSource<Item>([]);
  displayedColumns: string[] = ['name', 'quantity', 'price', 'total', 'action'];
  totalBill = 0;
  passwordVisible = false;
  // Progress bar properties for Profile Details
  isProfileLoading = false;
  showProfileProgress = false;
  profileProgress = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.userForm = this.fb.group({
      fullName: [this.currentUser.fullName, [Validators.required, Validators.minLength(2)]],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      password: [this.currentUser.password, [Validators.minLength(6)]]
    });

    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0.01)]]
    });

    this.settingsForm = this.fb.group({
      contactNumber: ['', [Validators.pattern(/^\+?\d{10,15}$/)]]
    });

    this.loadItems();
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  saveProfile(): void {
    if (this.userForm.invalid || this.userForm.pristine || this.isProfileLoading) {
      this.snackBar.open('Please fill all required fields correctly!', 'Close', { duration: 3000 });
      return;
    }

    if (!this.currentUser) return;

    this.isProfileLoading = true;
    this.showProfileProgress = true;
    this.profileProgress = 0;

    const interval = setInterval(() => {
      this.profileProgress += 10;
      if (this.profileProgress >= 100) {
        clearInterval(interval);
        this.showProfileProgress = false;
        this.isProfileLoading = false;

        const newEmail = this.userForm.get('email')!.value;
        const oldEmail = this.currentUser ? this.currentUser.email : '';

        const updatedUser: User = {
          ...this.currentUser!,
          fullName: this.userForm.get('fullName')!.value,
          email: newEmail,
          password: this.userForm.get('password')!.value 
        };

        this.authService.updateUser(updatedUser, oldEmail);
        this.currentUser = updatedUser;
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });

        if (newEmail !== oldEmail) {
          this.loadItems();
        }
      }
    }, 300);
  }

  addItem(): void {
    if (this.itemForm.invalid) {
      this.snackBar.open('Enter valid item details!', 'Close', { duration: 3000 });
      return;
    }

    const newItem: Item = this.itemForm.value;
    this.items.push(newItem);
    this.dataSource.data = this.items;
    this.saveItems();
    this.calculateTotal();
    this.itemForm.reset({ name: '', quantity: 1, price: 0 });
    this.snackBar.open('Item added successfully!', 'Close', { duration: 3000 });
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
    this.dataSource.data = this.items;
    this.saveItems();
    this.calculateTotal();
  }

  saveSettings(): void {
    if (this.settingsForm.invalid || this.settingsForm.pristine) {
      this.snackBar.open('Please enter a valid contact number!', 'Close', { duration: 3000 });
      return;
    }

    this.snackBar.open('Settings updated successfully!', 'Close', { duration: 3000 });
  }

  private loadItems(): void {
    const userItems = this.authService.getUserItems(this.currentUser!.email);
    this.items = userItems || [];
    this.dataSource.data = this.items;
    this.calculateTotal();
  }

  private saveItems(): void {
    if (this.currentUser) {
      this.authService.saveUserItems(this.currentUser.email, this.items);
    }
  }

  private calculateTotal(): void {
    this.totalBill = this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }
}