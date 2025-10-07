import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../../shared/materials/material/material.module';
import { ItemsAddService } from '../../../services/items/items-add.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  itemForm: FormGroup;
  items: any[] = [];
  editingItemId: number | null = null;
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
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
      discountPrice: [null, [Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
      quantityUnit: ['', Validators.required],
      shopName: ['', [Validators.required, Validators.minLength(2)]],
      details: [''],
      additionalDetails: [''],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadItems();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.editingItemId = +idParam;
        this.loadItemForEdit(this.editingItemId);
      }
    });
  }

  loadItems(): void {
    this.itemsService.getItems().subscribe({
      next: data => this.items = data || [],
      error: () => this.toastr.error('Failed to load items', 'Error')
    });
  }

  loadItemForEdit(id: number): void {
    this.itemsService.getItemById(id).subscribe({
      next: item => {
        this.itemForm.patchValue(item);
        this.previewImageUrl = item.imageUrl || null;
      },
      error: () => this.toastr.error('Failed to fetch item for edit', 'Error')
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
      this.toastr.error('Please fill all required fields correctly.', 'Error');
      return;
    }

    this.isSubmitting = true;
    const formValue = { ...this.itemForm.value };

    const fileToSend = this.selectedFile ?? undefined; // File | undefined

    if (this.editingItemId) {
      // Update
      this.itemsService.updateItem(this.editingItemId, formValue, fileToSend).subscribe({
        next: () => {
          this.toastr.success('Item updated successfully!', 'Success');
          this.router.navigate(['/modules/admin/vegetable/view-item']);
        },
        error: () => {
          this.toastr.error('Failed to update item', 'Error');
          this.isSubmitting = false;
        }
      });
    } else {
      // Add
      this.itemsService.addItem(formValue, fileToSend).subscribe({
        next: () => {
          this.toastr.success('Item added successfully!', 'Success');
          this.resetForm();
          this.loadItems();
          this.isSubmitting = false;
        },
        error: () => {
          this.toastr.error('Failed to add item', 'Error');
          this.isSubmitting = false;
        }
      });
    }
  }

  resetForm(): void {
    this.itemForm.reset({ price: 0, quantity: 1 });
    this.selectedFile = null;
    this.previewImageUrl = null;
    this.fileError = null;
    this.editingItemId = null;
  }

  onCancelEdit(): void {
    if (this.editingItemId) {
      this.router.navigate(['/modules/admin/vegetable/view-item']);
    } else {
      this.resetForm();
    }
  }

  onEditFromTable(item: any): void {
    if (!item?.id) return;
    this.router.navigate(['/modules/admin/vegetable/edit', item.id]);
  }

  onDelete(item: any): void {
    if (!item?.id) return;

    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.itemsService.deleteItem(item.id).subscribe({
        next: () => {
          this.toastr.warning(`"${item.name}" deleted successfully!`);
          this.items = this.items.filter(i => i.id !== item.id);
        },
        error: () => this.toastr.error('Failed to delete item', 'Error')
      });
    }
  }
}
