import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Render,
  Session,
} from '@nestjs/common';
import { ObjectIdPipe } from '../common/object-id.pipe.js';
import type { AppSession } from '../common/session.js';
import { StoreService } from '../store/store.service.js';
import {
  CartService,
  addToCart,
  checkoutSummary,
  isCartEmpty,
  removeFromCart,
  updateCartItem,
} from './cart.service.js';
import type { Cart } from './cart.types.js';

/**
 * Guests keep their cart in the session; logged-in customers also get it
 * persisted to the database. Every mutation returns the full cart as JSON so
 * the page can re-render the header widget.
 */
@Controller()
export class CartController {
  constructor(
    private readonly cart: CartService,
    private readonly store: StoreService,
  ) {}

  @Get('/Add-Cart/:id/:num')
  async add(
    @Param('id', ObjectIdPipe) id: string,
    @Param('num', ParseIntPipe) num: number,
    @Session() session: AppSession,
  ) {
    const product = await this.store.getProduct(id);
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    const quantity = Math.max(1, num);
    const cart = session.userId
      ? await this.cart.addForUser(session.userId, id, quantity)
      : addToCart(session.cart, product, quantity);
    return this.persist(session, cart);
  }

  @Get('/Delete-Item-Cart/:id')
  removeFromHeader(@Param('id', ObjectIdPipe) id: string, @Session() session: AppSession) {
    return this.remove(id, session);
  }

  @Post('/Delete-Item-Shooping-Cart/:id')
  removeFromCartPage(@Param('id', ObjectIdPipe) id: string, @Session() session: AppSession) {
    return this.remove(id, session);
  }

  @Post('/Update-Item-Cart/:id/:quanty')
  async update(
    @Param('id', ObjectIdPipe) id: string,
    @Param('quanty', ParseIntPipe) quanty: number,
    @Session() session: AppSession,
  ) {
    const quantity = Math.max(1, quanty);
    const cart = session.userId
      ? await this.cart.updateForUser(session.userId, id, quantity)
      : updateCartItem(session.cart, id, quantity);
    return this.persist(session, cart);
  }

  @Get('/Shooping-Cart')
  @Render('web/shopping-cart')
  cartPage() {
    return {};
  }

  @Get('/Checkout')
  @Render('web/checkout')
  checkout(@Session() session: AppSession) {
    return { summary: checkoutSummary(session.cart) };
  }

  private async remove(id: string, session: AppSession) {
    const cart = session.userId
      ? await this.cart.removeForUser(session.userId, id)
      : removeFromCart(session.cart, id);
    return this.persist(session, cart);
  }

  /** Saves the cart to the session (dropping it when empty) and returns it. */
  private persist(session: AppSession, cart: Cart): Cart {
    if (isCartEmpty(cart)) delete session.cart;
    else session.cart = cart;
    return cart;
  }
}
