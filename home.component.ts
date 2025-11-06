import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  featured: any[] = [];
  loading = true;

  constructor(private ps: ProductService, private cart: CartService) {}

  ngOnInit() {
    this.loading = true;
    this.ps.getAllProducts().subscribe({
      next: (p) => {
        this.featured = p.slice(0, 8);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading featured products:', err);
        this.featured = [];
        this.loading = false;
      }
    });
  }

  addToCart(product: any) {
    this.cart.add(product, 1);
  }
}
