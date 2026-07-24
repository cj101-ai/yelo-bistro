export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Noodles' | 'Burgers' | 'Shawarma' | 'Rice Meals' | 'Pasta' | 'Wings' | 'Cocktail Wings'|'Combo Deals' |'Proteins' |'Specials' |'BreakFast'|'Juice & Drinks' ;
  isFeatured?: boolean;
  rating: number;
  prepTime: string; // e.g. "15 mins"
  calories?: number;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
}

export type OrderStatus = 'received' | 'preparing' | 'on_the_way' | 'delivered';

export interface OrderDetails {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  timestamp: string;
  notes?: string;
  paymentMethod: 'Delivery' | 'Pick-up';
}
