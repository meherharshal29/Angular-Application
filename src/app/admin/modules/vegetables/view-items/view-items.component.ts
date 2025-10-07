import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/materials/material/material.module';
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
  loading: boolean = false;

  constructor(
    private itemsService: ItemsAddService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.itemsService.getItems().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.message || 'Failed to load items', 'Error', { timeOut: 3000 });
        this.loading = false;
      }
    });
  }

onEdit(item: any): void {
  if (!item?.id) return;
  this.router.navigate(['/modules/admin/vegetable/edit', item.id]);
}


  onDelete(item: any): void {
    if (!item || !item.id) return;

    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.itemsService.deleteItem(item.id).subscribe({
        next: () => {
          this.toastr.warning(`"${item.name}" deleted successfully!`, 'Deleted', { timeOut: 3000 });
          this.items = this.items.filter(i => i.id !== item.id); // Remove deleted item from list
        },
        error: (err) => {
          this.toastr.error(err.message || 'Failed to delete item', 'Error', { timeOut: 3000 });
        }
      });
    }
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
    const fallback = event.target.parentNode.querySelector('span');
    if (fallback) fallback.style.display = 'block';
  }
}
