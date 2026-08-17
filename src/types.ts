export type FoodOptionType = 'radio' | 'checkbox';

export interface FoodOptionChoice {
  id: string;
  name: string;
  price: number;
}

export interface FoodOptionGroup {
  id: string;
  name: string;
  type: FoodOptionType;
  required?: boolean;
  choices: FoodOptionChoice[];
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;

  category:
    | 'Noodles'
    | 'Burgers'
    | 'Shawarma'
    | 'Rice Meals'
    | 'Pasta'
    | 'Wings'
    | 'Cocktail Wings'
    | 'Combo Deals'
    | 'Proteins'
    | 'Specials'
    | 'BreakFast'
    | 'Juice & Drinks';

  isFeatured?: boolean;
  rating: number;
  prepTime: string;
  calories?: number;

  // Customization options for this specific food item.
  // Items without customization simply don't have this property.
  options?: FoodOptionGroup[];
}

export interface SelectedFoodOption {
  groupId: string;
  groupName: string;
  choiceId: string;
  choiceName: string;
  price: number;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;

  // Options selected by the customer.
  selectedOptions: SelectedFoodOption[];

  // Base food price + selected option prices.
  unitPrice: number;

  // Unique identifier for this exact configuration.
  cartItemId: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
}

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'on_the_way'
  | 'delivered';

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