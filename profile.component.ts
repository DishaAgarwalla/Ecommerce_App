import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  orders: any[] = [];

  constructor(private auth: AuthService, private orderService: OrderService) {}

  ngOnInit() {
    this.auth.currentUser.subscribe(u => {
      this.user = u;
      if (u?.id) {
        this.orderService.getOrdersForUser(u.id as number).subscribe({
          next: (res: any) => this.orders = res || [],
          error: (err) => console.error('Error loading orders:', err)
        });
      }
    });
  }

  logout() {
    this.auth.logout();
  }

  getDeliveredCount(): number {
    return this.orders.filter(o => o.status === 'Delivered').length;
  }

  getProcessingCount(): number {
    return this.orders.filter(o => o.status === 'Processing').length;
  }
}
