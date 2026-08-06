export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  category: string;
  material: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string | null;
  color: string | null;
  quantity: number;
  image: string;
}

export interface AdminSession {
  user: {
    id: string;
    email: string;
  };
}
