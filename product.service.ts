import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // Map backend filenames to local filenames
  private mapFilenameToLocal(filename: string, productName: string): string {
    const mapping: { [key: string]: string } = {
      'phone1.jpg': 'samsung-galaxy-s24-ultra.jpg',
      'laptop1.jpg': 'dell-xps-13.jpg',
      'shoes1.jpg': 'nike-air-zoom-pegasus-40.jpg',
      'mixer1.jpg': 'philips-mixer-grinder.jpg',
      'cream1.jpg': 'nivea-soft-cream.jpeg',
      'headphones1.jpg': 'sony-wh-1000xm5.jpg',
      'book1.jpg': 'atomic-habits-book.jpg',
      'revitalift.jpg': 'loreal-revitalift-cream.jpg',
      'foundation.jpg': 'maybelline-fit-me-foundation.jpg',
      'kajal.jpg': 'lakme-eyeconic-kajal.jpg',
      'nivea-lotion.jpg': 'nivea-body-lotion.jpg',
      'dove-shampoo.jpg': 'dove-shampoo.jpg',
      'mamaearth-facewash.jpg': 'mamaearth-vitamin-c-face-wash.jpg',
      'himalaya-pack.jpg': 'himalaya-neem-face-pack.jpg',
      'ponds-cream.jpg': 'ponds-cold-cream.jpg',
      'lipstick.jpg': 'nykaa-lipstick.jpg',
      'beardo-oil.jpg': 'beardo-beard-oil.jpg',
      'tata-salt.jpg': 'tata-salt.jpg',
      'aashirvaad-atta.jpg': 'aashirvaad-atta.jpg',
      'fortune-oil.jpg': 'fortune-sunflower-oil.jpg',
      'milk-powder.jpg': 'nestle-everyday-milk-powder.jpg',
      'red-label.jpg': 'red-label-tea.jpg',
      'bru-coffee.jpg': 'bru-coffee.jpg',
      'maggi.jpg': 'maggi-noodles.jpg',
      'amul-butter.jpg': 'amul-butter.jpg',
      'parle-g.jpg': 'parle-g-biscuits.jpg',
      'cheese-slices.jpg': 'britannia-cheese-slices.jpg',
      's24.jpg': 'samsung-galaxy-s24.jpg',
      'macbook-air.jpg': 'apple-macbook-air-m2.jpg',
      'mi-band.jpg': 'mi-smart-band-8.jpg',
      'airdopes.jpg': 'boat-airdopes-161.jpg',
      'jeans.jpg': 'levis-denim-jeans.jpg',
      'tshirt.jpg': 'hm-cotton-tshirt.jpg',
      'shoes.jpg': 'adidas-running-shoes.jpg',
      'watch.jpg': 'titan-analog-watch.jpg',
      'jacket.jpg': 'puma-sports-jacket.jpg',
      'led-bulb.jpg': 'philips-led-bulb-12w.jpg',
      'milton-bottle.jpg': 'milton-thermosteel-bottle.jpg',
      'cooker.jpg': 'prestige-pressure-cooker.jpg',
      'fan.jpg': 'havells-ceiling-fan.jpg',
      'pillow.jpg': 'sleepwell-pillow.jpg'
    };
    return mapping[filename] || filename; // fallback to original if not mapped
  }

  // ✅ Get all products (handles backend {success, message, data})
  getAllProducts(): Observable<Product[]> {
    return this.http.get<any>(this.base).pipe(
      map(response => {
        const products = response.data || [];
        // Transform imageUrl to use local assets if it starts with /assets/images/
        return products.map((product: any) => {
          let transformedImageUrl = product.imageUrl;
          if (product.imageUrl?.startsWith('/assets/images/')) {
            // Extract filename from backend URL (e.g., /assets/images/phone1.jpg -> phone1.jpg)
            const filename = product.imageUrl.split('/').pop();
            // Map to local filename (e.g., phone1.jpg -> samsung-galaxy-s24-ultra.jpg based on product name)
            const localFilename = this.mapFilenameToLocal(filename, product.name);
            transformedImageUrl = `assets/images/products/${localFilename}`;
          }
          return {
            ...product,
            imageUrl: transformedImageUrl,
            images: product.images || [transformedImageUrl] // Add images array with the main image
          };
        });
      })
    );
  }

  // ✅ Get product by ID
  getById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(
      map(response => {
        const product = response.data;
        let transformedImageUrl = product.imageUrl;
        if (product.imageUrl?.startsWith('/assets/images/')) {
          const filename = product.imageUrl.split('/').pop();
          const localFilename = this.mapFilenameToLocal(filename, product.name);
          transformedImageUrl = `assets/images/products/${localFilename}`;
        }
        return {
          ...product,
          imageUrl: transformedImageUrl,
          images: product.images || [transformedImageUrl] // Add images array with the main image
        };
      })
    );
  }

  // ✅ Search products by keyword
  search(keyword: string): Observable<Product[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<any>(`${this.base}/search`, { params }).pipe(
      map(response => {
        const products = response.data || [];
        return products.map((product: any) => {
          let transformedImageUrl = product.imageUrl;
          if (product.imageUrl?.startsWith('/assets/images/')) {
            const filename = product.imageUrl.split('/').pop();
            const localFilename = this.mapFilenameToLocal(filename, product.name);
            transformedImageUrl = `assets/images/products/${localFilename}`;
          }
          return {
            ...product,
            imageUrl: transformedImageUrl,
            images: product.images || [transformedImageUrl] // Add images array with the main image
          };
        });
      })
    );
  }

  // ✅ Create new product
  create(product: Product): Observable<Product> {
    return this.http.post<any>(this.base, product).pipe(
      map(response => response.data)
    );
  }

  // ✅ Update existing product
  update(id: number, product: Product): Observable<Product> {
    return this.http.put<any>(`${this.base}/${id}`, product).pipe(
      map(response => response.data)
    );
  }

  // ✅ Delete product
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
