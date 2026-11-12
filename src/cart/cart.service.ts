import { Injectable } from '@nestjs/common';
import type { Product } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Cart, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from './cart.types.js';

export function emptyCart(): Cart {
  return { items: {}, totalPrice: 0, totalQuantity: 0 };
}

/** Recomputes the totals from the line items. */
function recalc(cart: Cart): Cart {
  let totalPrice = 0;
  let totalQuantity = 0;
  for (const item of Object.values(cart.items)) {
    item.lineTotal = item.quantity * item.product.price;
    totalPrice += item.lineTotal;
    totalQuantity += item.quantity;
  }
  cart.totalPrice = totalPrice;
  cart.totalQuantity = totalQuantity;
  return cart;
}

export function addToCart(cart: Cart | undefined, product: Product, quantity: number): Cart {
  const next = cart ?? emptyCart();
  const existing = next.items[product.id];
  next.items[product.id] = {
    quantity: (existing?.quantity ?? 0) + quantity,
    lineTotal: 0,
    product,
  };
  return recalc(next);
}

export function updateCartItem(cart: Cart | undefined, productId: string, quantity: number): Cart {
  const next = cart ?? emptyCart();
  const item = next.items[productId];
  if (item) item.quantity = quantity;
  return recalc(next);
}

export function removeFromCart(cart: Cart | undefined, productId: string): Cart {
  const next = cart ?? emptyCart();
  delete next.items[productId];
  return recalc(next);
}

export function isCartEmpty(cart: Cart | undefined): boolean {
  return !cart || Object.keys(cart.items).length === 0;
}

export function checkoutSummary(cart: Cart | undefined) {
  const subtotal = cart?.totalPrice ?? 0;
  const shippingFee = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { subtotal, shippingFee, total: subtotal + shippingFee };
}

/** Persists carts of logged-in customers in the CartItem collection. */
@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addForUser(userId: string, productId: string, quantity: number): Promise<Cart> {
    await this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId, quantity },
      update: { quantity: { increment: quantity } },
    });
    return this.loadForUser(userId);
  }

  async updateForUser(userId: string, productId: string, quantity: number): Promise<Cart> {
    await this.prisma.cartItem.updateMany({ where: { userId, productId }, data: { quantity } });
    return this.loadForUser(userId);
  }

  async removeForUser(userId: string, productId: string): Promise<Cart> {
    await this.prisma.cartItem.deleteMany({ where: { userId, productId } });
    return this.loadForUser(userId);
  }

  async loadForUser(userId: string): Promise<Cart> {
    const rows = await this.prisma.cartItem.findMany({ where: { userId }, include: { product: true } });
    let cart = emptyCart();
    for (const row of rows) cart = addToCart(cart, row.product, row.quantity);
    return cart;
  }
}
