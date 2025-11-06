import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  userId = 1; // Replace with actual logged-in user ID

  searchOrderId: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrdersForUser(this.userId).subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = data;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }

  filterOrders(): void {
    let filtered = this.orders;

    // 🔍 Filter by Order ID
    if (this.searchOrderId.trim()) {
      filtered = filtered.filter(o =>
        o.id?.toString().includes(this.searchOrderId.trim())
      );
    }

    // 📅 Filter by Date Range
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      filtered = filtered.filter(o => {
        const orderDate = o.createdAt ? new Date(o.createdAt) : null;
        return orderDate && orderDate >= start && orderDate <= end;
      });
    }

    this.filteredOrders = filtered;
  }

  resetFilters(): void {
    this.searchOrderId = '';
    this.startDate = '';
    this.endDate = '';
    this.filteredOrders = this.orders;
  }

  viewOrderDetails(orderId: number): void {
    console.log('View order details for:', orderId);
    // this.router.navigate(['/orders', orderId]);
  }
}
