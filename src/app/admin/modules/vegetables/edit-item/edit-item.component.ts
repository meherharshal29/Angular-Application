import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../../shared/materials/material/material.module';
import { ItemsAddService } from '../../../services/items/items-add.service';

@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  itemForm: FormGroup;
  itemId!: number;
  previewImageUrl: string | null = null;
  selectedFile: File | null = null;
  fileError: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private itemsService: ItemsAddService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      discountPrice: [null, Validators.min(0)],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
      quantityUnit: ['', Validators.required],
      shopName: ['', [Validators.required, Validators.minLength(2)]],
      imageUrl: [''],
      details: [''],
      additionalDetails: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['editId']) {
        this.itemId = +params['editId'];
        this.loadItem(this.itemId);
      } else {
        this.toastr.error('No item selected for editing', 'Error');
        this.router.navigate(['/modules/admin/vegetable/view']);
      }
    });
  }

  loadItem(id: number): void {
    this.itemsService.getItemById(id).subscribe({
      next: (item) => {
        this.itemForm.patchValue(item);
        this.previewImageUrl = item.imageUrl || null;
      },
      error: () => {
        this.toastr.error('Failed to load item', 'Error');
        this.router.navigate(['/modules/admin/vegetable/view']);
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.fileError = null;

    if (file) {
      if (!file.type.startsWith('image/')) {
        this.fileError = 'Please select a valid image file.';
        event.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = 'File size must be less than 5MB.';
        event.target.value = '';
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewImageUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.toastr.error('Please fill all required fields correctly.', 'Error', { timeOut: 3000 });
      return;
    }

    this.isSubmitting = true;
    const formValue = { ...this.itemForm.value };
    const file = this.selectedFile || null;

    this.itemsService.updateItem(this.itemId, formValue, file).subscribe({
      next: () => {
        this.toastr.success('Item updated successfully!', 'Success');
        this.router.navigate(['/modules/admin/vegetable/view']);
      },
      error: () => {
        this.toastr.error('Failed to update item', 'Error');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/modules/admin/vegetable/view']);
  }
}
