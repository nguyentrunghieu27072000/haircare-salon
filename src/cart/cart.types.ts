import type { Product } from '../generated/prisma/client.js';

/** Shape shared by the session cart, the DB-backed cart and the AJAX responses. */
export interface CartItem {
  quantity: number;
  /** quantity × product.price */
  lineTotal: number;
  product: Product;
}

export interface Cart {
  /** Keyed by product id. */
  items: Record<string, CartItem>;
  totalPrice: number;
  totalQuantity: number;
}

export const FREE_SHIPPING_THRESHOLD = 500_000;
export const SHIPPING_FEE = 30_000;
