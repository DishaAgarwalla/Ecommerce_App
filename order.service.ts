import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private base = `${environment.apiUrl}/orders`;  // ✅ Connects to http://localhost:8080/api/orders

  constructor(private http: HttpClient) {}

  placeOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.base, order);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.base);
  }

  getOrdersForUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/user/${userId}`);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.base}/${id}/status`, { status });
  }
}
