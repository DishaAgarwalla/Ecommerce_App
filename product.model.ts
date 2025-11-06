export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  images?: string[];
  imageUrl?: string;
  stock?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}
