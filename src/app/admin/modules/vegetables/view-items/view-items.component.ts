import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/materials/material/material.module';  // Adjust path as needed
import { ItemsAddService } from '../../../services/items/items-add.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-items',  
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss']
})
export class ViewItemsComponent implements OnInit {
  items: any[] = [];

  constructor(
    private itemsService: ItemsAddService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemsService.getItems().subscribe({
      next: (data) => this.items = data,
      error: () => this.toastr.error('Failed to load items', 'Error', { timeOut: 3000 })
    });
  }

  onEdit(item: any): void {
    // Navigate to add/edit route with item ID (adjust route as per your setup)
    this.router.navigate(['/modules/admin/vegetable/add'], { queryParams: { editId: item.id } });
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

  onImageError(event: any): void {
    // Handle broken images gracefully
    event.target.style.display = 'none';
    const fallback = event.target.parentNode.querySelector('span');
    if (fallback) fallback.style.display = 'block';
  }
}