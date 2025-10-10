import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<{ searchTerm: string, category: string, priceRange: number[] }>();

  searchTerm: string = '';
  category: string = '';
  priceRange: number[] = [0, 1000];
  categories: string[] = ['All', 'Fruits & Vegetables', 'Organic Grains', 'Dairy', 'Herbs & Spices'];

  onFilterChange() {
    this.filterChange.emit({
      searchTerm: this.searchTerm,
      category: this.category,
      priceRange: this.priceRange
    });
  }

  onSearchChange() {
    this.onFilterChange();
  }

  onCategoryChange() {
    this.onFilterChange();
  }

  onPriceChange() {
    this.onFilterChange();
  }
}