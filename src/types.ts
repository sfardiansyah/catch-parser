export interface OrderSummary {
  order_id: number;
  order_datetime: string;
  total_order_value: number;
  average_unit_price: number;
  distinct_unit_count: number;
  total_unit_count: number;
  customer_state: string;
}

export interface OrderRecord {
  order_id: number;
  order_date: string;
  customer: Customer;
  items: Item[];
  discounts: Discount[];
  shipping_price: number;
}

interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  shipping_address: ShippingAddress;
}

interface ShippingAddress {
  street: string;
  postcode: string;
  suburb: string;
  state: string;
}

export interface Item {
  quantity: number;
  unit_price: number;
  product: Product;
}

interface Product {
  product_id: number;
  title: string;
  subtitle?: string;
  image: string;
  thumbnail: string;
  category: string[];
  url: string;
  upc: string;
  created_at: Date;
  brand: Brand;
}

interface Brand {
  id: number;
  name: string;
}

export interface Discount {
  type: 'PERCENTAGE' | 'DOLLAR';
  value: number;
  priority: number;
}
