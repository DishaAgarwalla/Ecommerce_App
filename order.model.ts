export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id?: number;
  userId?: number;
  items: OrderItem[];
  total: number;
  status?: string;              // e.g., 'Pending', 'Shipped', 'Delivered'
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;       // e.g., 'COD', 'Credit Card', etc.
  createdAt?: string;           // ISO date string
}
