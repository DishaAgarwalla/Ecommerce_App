import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];

  constructor(private ps: ProductService) {}

  ngOnInit() {
    this.ps.getAllProducts().subscribe(p => this.products = p);
  }

  deleteProduct(id: number) {
    if (confirm('Delete product?')) {
      this.ps.delete(id).subscribe(() => {
        this.products = this.products.filter(x => x.id !== id);
      });
    }
  }
}
