import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../../shared/materials/material/material.module';
import { ItemsAddService } from '../../../services/items/items-add.service';
import { AdminRoutingModule } from "../../../admin-routing.module";

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule, AdminRoutingModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  itemForm: FormGroup;
  items: any[] = [];
  editingItemId: number | null = null;
  previewImageUrl: string | null = null;
  fileError: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private itemsService: ItemsAddService,
    private toastr: ToastrService
  ) {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      quantityUnit: ['', Validators.required],
      discountPrice: [null],
      shopName: ['', [Validators.required, Validators.minLength(2)]],
      imageUrl: [''],  // Optional, no required validator
      details: [''],
      additionalDetails: ['']
    });
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemsService.getItems().subscribe({
      next: (data) => this.items = data,
      error: () => this.toastr.error('Failed to load items', 'Error', { timeOut: 3000 })
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.fileError = null;

    if (file) {
      // Validate file type and size (5MB max)
      if (!file.type.startsWith('image/')) {
        this.fileError = 'Please select a valid image file.';
        event.target.value = '';  // Clear input
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = 'File size must be less than 5MB.';
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;  // Base64 data URL
        this.itemForm.patchValue({ imageUrl: this.previewImageUrl });
      };
      reader.readAsDataURL(file);
      console.log('Selected file converted to base64:', file.name);
    }
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.', 'Error', { timeOut: 3000 });
      return;
    }

    this.isSubmitting = true;
    const formValue = { ...this.itemForm.value };

    if (this.editingItemId !== null) {
      // Edit mode
      this.itemsService.updateItem(this.editingItemId, formValue).subscribe({
        next: () => {
          this.toastr.success('Item updated successfully!', 'Success', { timeOut: 3000 });
          this.resetForm();
          this.loadItems();
        },
        error: () => this.toastr.error('Failed to update item', 'Error', { timeOut: 3000 })
      });
    } else {
      // Add mode
      this.itemsService.addItem(formValue).subscribe({
        next: () => {
          this.toastr.success('Item added successfully!', 'Success', { timeOut: 3000 });
          this.resetForm();
          this.loadItems();
        },
        error: () => this.toastr.error('Failed to add item', 'Error', { timeOut: 3000 })
      });
    }
    this.isSubmitting = false;
  }

  private resetForm(): void {
    this.itemForm.reset({
      price: 0,
      quantity: 1
    });
    this.editingItemId = null;
    this.previewImageUrl = null;
    this.fileError = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onEdit(item: any): void {
    this.editingItemId = item.id;
    this.itemForm.patchValue(item);
    this.previewImageUrl = item.imageUrl || null;  // Set preview for edit
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemsService.deleteItem(id).subscribe({
        next: () => {
          this.toastr.warning('Item deleted!', 'Deleted', { timeOut: 3000 });
          this.loadItems();
        },
        error: () => this.toastr.error('Failed to delete item', 'Error', { timeOut: 3000 })
      });
    }
  }

  onCancelEdit(): void {
    this.resetForm();
  }
}