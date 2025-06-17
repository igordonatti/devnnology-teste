export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string[];
  origin: 'EU' | 'BR';
}

export interface ProductResponse {
  data: Product[];
  page: string;
  total: number;
  limit: string;
  totalPages: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
} 