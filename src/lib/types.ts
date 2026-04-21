export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  tags: string[];
  description: string;
  badge?: string;
};

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

export type User = {
  email: string;
  name: string;
};
