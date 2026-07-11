export interface Product {
  id: number;
  name: string;
  category: string;
  badge: string;
  badgeClass: string;
  price: number;
  oldPrice: number;
  desc: string;
  image: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
}