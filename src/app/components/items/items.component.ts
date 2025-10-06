import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../shared/materials/material/material.module';
import { ItemsAddService } from '../../admin/services/items/items-add.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  items: any[] = [];
  isLoading = true;

  constructor(
    private itemService: ItemsAddService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

loadItems(): void {
    this.itemService.getItems().subscribe({
        next: (data) => {
            console.log('Items:', data); // Log to inspect imageUrl
            this.items = data.map(item => ({
                ...item,
                imageUrl: item.imageUrl 
            }));
            this.isLoading = false;
        },
        error: () => {
            this.toastr.error('Failed to load items', 'Error', { timeOut: 3000 });
            this.isLoading = false;
        }
    });
}
}
