import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/material/material.module';

@Component({
  selector: 'app-vegetable',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './vegetable.component.html',
  styleUrls: ['./vegetable.component.scss']
})
export class VegetableComponent {
  vegetables = [
    {
      name: 'Tomato',
      price: 200,          // in ₹ per kg
      originalPrice: 250,
      discount: 20,
      image: 'https://media.istockphoto.com/id/1132371208/photo/three-ripe-tomatoes-on-green-branch.jpg?s=612x612&w=0&k=20&c=qVjDb5Tk3-UccV-E9gqvoz97PTsP1QmBftw27qA9kEo='
    },
    {
      name: 'Carrot',
      price: 150,
      originalPrice: 180,
      discount: 17,
      image: 'https://media.istockphoto.com/id/185275579/photo/bundles-of-organic-carrots-with-the-stems-still-attached.jpg?s=612x612&w=0&k=20&c=OIdIDUtDF9jxpCFnZlb7ld5tOj8pDMol1XIcfsHFlEk='
    },
    {
      name: 'Broccoli',
      price: 320,
      originalPrice: 400,
      discount: 20,
      image: 'https://www.greendna.in/cdn/shop/products/brocoli44_b6fb2ffa-ffed-47b2-9276-002a6cc76312_600x.jpg?v=1595081087'
    },
    {
      name: 'Lettuce',
      price: 150,
      originalPrice: 180,
      discount: 17,
      image: 'https://m.media-amazon.com/images/I/61N47x09qQL._UF1000,1000_QL80_.jpg'
    },
    {
      name: 'Potato',
      price: 120,
      originalPrice: 150,
      discount: 20,
      image: 'https://www.greendna.in/cdn/shop/files/potato5_780x.jpg?v=1705148641'
    },
    {
      name: 'Potato',
      price: 120,
      originalPrice: 150,
      discount: 20,
      image: 'https://www.greendna.in/cdn/shop/files/potato5_780x.jpg?v=1705148641'
    },
    {
      name: 'Potato',
      price: 120,
      originalPrice: 150,
      discount: 20,
      image: 'https://www.greendna.in/cdn/shop/files/potato5_780x.jpg?v=1705148641'
    },
    {
      name: 'Potato',
      price: 120,
      originalPrice: 150,
      discount: 20,
      image: 'https://www.greendna.in/cdn/shop/files/potato5_780x.jpg?v=1705148641'
    },
    {
      name: 'Onion',
      price: 100,
      originalPrice: 120,
      discount: 17,
      image: 'https://www.greendna.in/cdn/shop/products/onion-1565604_1920_1920x.jpg?v=1593270120'
    }
  ];

  addToCart(vegetable: any): void {
    console.log('Added to cart:', vegetable);
  }

  buyNow(vegetable: any): void {
    console.log('Buy now:', vegetable);
  }
}
