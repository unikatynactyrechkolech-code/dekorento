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
  // Detailní info — vyplňuje admin
  material?: string;
  size?: string;
  stojan?: string;
  doprava?: string;
  video_url?: string;
  requires_construction?: boolean;
  construction_price?: number;
};

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

/** @deprecated Použij `AppUser` z `@/context/AuthContext` */
export type User = {
  id?: string;
  email: string;
  name: string;
};
