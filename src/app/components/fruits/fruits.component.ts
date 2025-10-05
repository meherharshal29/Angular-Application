import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/material/material.module';

@Component({
  selector: 'app-fruits',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './fruits.component.html',
  styleUrls: ['./fruits.component.scss']
})
export class FruitsComponent {
  fruits = [
    { 
      name: 'Apple', 
      price: 150, 
      originalPrice: 200,
      image: 'https://m.media-amazon.com/images/I/61Erom0dqNL.jpg' 
    },
    { 
      name: 'Banana', 
      price: 80, 
      originalPrice: 100,
      image: 'https://png.pngtree.com/thumb_back/fh260/background/20240813/pngtree-d-ripe-bananas-hanging-on-a-tree-at-sunset-golden-hour-image_16153002.jpg' 
    },
    { 
      name: 'Orange', 
      price: 200, 
      originalPrice: 250,
      image: 'https://www.greendna.in/cdn/shop/products/orange70_1024x.jpg?v=1572447095' 
    },
    { 
      name: 'Grape', 
      price: 350, 
      originalPrice: 400,
      image: 'https://5.imimg.com/data5/SELLER/Default/2023/12/367085979/LZ/GW/UJ/108501955/fresh-organic-grapes.jpg' 
    },
    { 
      name: 'Mango', 
      price: 280, 
      originalPrice: 350,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDBMPCdwhGCiVjxqNBHVVRRgaQoK2BmKj4ZA&s' 
    },
    { 
      name: 'Strawberry', 
      price: 420, 
      originalPrice: 500,
      image: 'https://ifestore.com/wp-content/uploads/2023/12/strawaberry-2.jpg' 
    }
  ];

  // Calculate discount %
  getDiscount(fruit: any): number {
    if (fruit.originalPrice && fruit.price) {
      return Math.round(((fruit.originalPrice - fruit.price) / fruit.originalPrice) * 100);
    }
    return 0;
  }

  addToCart(fruit: any): void {
    console.log('Added to cart:', fruit);
  }

  buyNow(fruit: any): void {
    console.log('Buy now:', fruit);
  }
}
