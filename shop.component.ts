import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html'
})
export class ShopComponent implements OnInit {
  products: any[] = [];
  loading = true;

  constructor(private ps: ProductService, private cart: CartService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.ps.getAllProducts().subscribe({
      next: (p) => {
        this.products = p || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.products = [];
        this.loading = false;
      }
    });
  }

  addToCart(p: any) {
    this.cart.add(p, 1);
  }
}
