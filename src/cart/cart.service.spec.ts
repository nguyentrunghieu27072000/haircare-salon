import type { Product } from '../generated/prisma/client.js';
import {
  addToCart,
  checkoutSummary,
  isCartEmpty,
  removeFromCart,
  updateCartItem,
} from './cart.service.js';

const product = (id: string, price: number): Product => ({
  id,
  categoryId: '000000000000000000000001',
  name: `Product ${id}`,
  price,
  image: 'product1.jpg',
  info: null,
  description: null,
  usage: null,
});

const A = '6af000000000000000000001';
const B = '6af000000000000000000002';

describe('cart helpers', () => {
  it('adds items and accumulates quantities', () => {
    let cart = addToCart(undefined, product(A, 100), 2);
    cart = addToCart(cart, product(A, 100), 1);
    cart = addToCart(cart, product(B, 50), 1);

    expect(cart.items[A].quantity).toBe(3);
    expect(cart.items[A].lineTotal).toBe(300);
    expect(cart.totalQuantity).toBe(4);
    expect(cart.totalPrice).toBe(350);
  });

  it('updates and removes items, recomputing totals', () => {
    let cart = addToCart(undefined, product(A, 100), 1);
    cart = addToCart(cart, product(B, 50), 1);

    cart = updateCartItem(cart, A, 5);
    expect(cart.totalPrice).toBe(550);
    expect(cart.totalQuantity).toBe(6);

    cart = removeFromCart(cart, A);
    expect(cart.totalPrice).toBe(50);
    expect(isCartEmpty(cart)).toBe(false);

    cart = removeFromCart(cart, B);
    expect(isCartEmpty(cart)).toBe(true);
  });

  it('charges shipping only for orders of 500K or less', () => {
    const small = addToCart(undefined, product(A, 200_000), 1);
    expect(checkoutSummary(small)).toEqual({ subtotal: 200_000, shippingFee: 30_000, total: 230_000 });

    const big = addToCart(undefined, product(A, 600_000), 1);
    expect(checkoutSummary(big)).toEqual({ subtotal: 600_000, shippingFee: 0, total: 600_000 });

    expect(checkoutSummary(undefined)).toEqual({ subtotal: 0, shippingFee: 30_000, total: 30_000 });
  });
});
