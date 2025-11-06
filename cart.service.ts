import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly cartKey = 'ecom_cart';
  private cartItems: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  private countSubject = new BehaviorSubject<number>(0);

  // Observables to subscribe in components
  items$ = this.itemsSubject.asObservable();
  count$ = this.countSubject.asObservable();

  constructor() {
    this.cartItems = this.loadFromStorage();
    this.updateSubjects();
  }

  /** Load cart from localStorage */
  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.cartKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /** Save cart to localStorage */
  private saveToStorage() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    this.updateSubjects();
  }

  /** Emit current cart and count */
  private updateSubjects() {
    this.itemsSubject.next(this.cartItems);
    const count = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.countSubject.next(count);
  }

  /** Get current items */
  getItems(): Observable<CartItem[]> {
    return this.items$;
  }

  /** Add a product to cart */
  add(product: Product, qty = 1) {
    const existing = this.cartItems.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.cartItems.push({ product, quantity: qty });
    }
    this.saveToStorage();
  }

  /** Update quantity for a product */
  update(productId: number, qty: number) {
    this.cartItems = this.cartItems
      .map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
      .filter(i => i.quantity > 0);
    this.saveToStorage();
  }

  /** Remove a product */
  remove(productId: number) {
    this.cartItems = this.cartItems.filter(i => i.product.id !== productId);
    this.saveToStorage();
  }

  /** Clear entire cart */
  clear() {
    this.cartItems = [];
    this.saveToStorage();
  }

  /** Get total price */
  getTotal(): number {
    return this.cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }
}
