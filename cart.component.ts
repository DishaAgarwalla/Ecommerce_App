import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  totalPrice = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.getItems().subscribe((items) => {
      this.items = items;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.totalPrice = this.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.update(productId, quantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.remove(item.product.id);
  }

  clearCart(): void {
    this.cartService.clear();
  }

  continueShopping(): void {
    this.router.navigate(['/home']);
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
