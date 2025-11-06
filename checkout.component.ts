import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  address: any = {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  };
  paymentMethod = 'COD';
  items: any[] = [];

  constructor(
    private cart: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cart.getItems().subscribe(i => this.items = i);
  }

  get total() {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  placeOrder() {
    if (!this.address.fullName || !this.address.address || !this.address.phone) {
      alert('Please fill all required fields.');
      return;
    }

    const order = {
      items: this.items.map(i => ({
        productId: i.product.id,
        price: i.product.price,
        quantity: i.quantity,
        name: i.product.name
      })),
      total: this.total,
      shippingAddress: this.address,
      paymentMethod: this.paymentMethod
    };

    this.orderService.placeOrder(order).subscribe({
      next: (res: any) => {
        const id = res?.id || res?.orderId;
        this.cart.clear();
        this.router.navigate(['/order-confirmation', id]);
      },
      error: (err) => {
        alert('Order failed: ' + (err?.error?.message || err.message));
      }
    });
  }
}
