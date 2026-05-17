/** Pomocné typy mapující DB sloupce */

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  in_stock: boolean;
  image: string | null;
  images: string[];
  category: string | null;
  category_id: string | null;
  tags: string[];
  badge: string | null;
  active: boolean;
  // Detailní info
  material: string | null;
  size: string | null;
  stojan: string | null;
  doprava: string | null;
  video_url: string | null;
  requires_construction: boolean;
  construction_price: number;
  created_at: string;
  updated_at: string;
};

export type DbOrder = {
  id: string;
  order_number: string;
  user_id: string | null;
  email: string;
  full_name: string;
  phone: string | null;
  street: string | null;
  city: string | null;
  postal_code: string | null;
  country: string;
  note: string | null;
  total: number;
  status: "pending" | "paid" | "confirmed" | "shipped" | "completed" | "cancelled";
  payment_method: string | null;
  payment_id: string | null;
  rental_from: string | null;
  rental_to: string | null;
  created_at: string;
  updated_at: string;
};

export type DbOrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_slug: string | null;
  product_image: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export type DbProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  street: string | null;
  city: string | null;
  postal_code: string | null;
  country: string;
};
