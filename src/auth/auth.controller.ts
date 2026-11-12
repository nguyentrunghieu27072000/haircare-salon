import { Body, Controller, Get, Post, Query, Redirect, Req, Session } from '@nestjs/common';
import type { Request } from 'express';
import type { AppSession } from '../common/session.js';
import { CartService, isCartEmpty } from '../cart/cart.service.js';
import { AuthService } from './auth.service.js';

const PHONE_RE = /^0\d{9}$/;

/**
 * Phone-number login. The OTP step for new numbers is done client-side with
 * Firebase (public/js/main2.js); the server only stores the password after.
 */
@Controller()
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly cart: CartService,
  ) {}

  /** Used by the login modal: "0" when the number is new, else the number. */
  @Get('/Check-User')
  async checkUser(@Query('user') phone?: string) {
    const user = phone ? await this.auth.findByPhone(phone.trim()) : null;
    return user?.phone ?? '0';
  }

  @Post('/Login')
  async login(@Body() body: { user?: string; pass?: string }, @Session() session: AppSession) {
    const user = body.user && body.pass ? await this.auth.login(body.user.trim(), body.pass) : null;
    if (!user) return 'fail';
    await this.signIn(session, user.id, user.phone);
    return 'ok';
  }

  @Post('/Add-Account')
  @Redirect('/Home')
  async addAccount(
    @Body() body: { completed?: string; password1?: string; password2?: string },
    @Session() session: AppSession,
  ) {
    const phone = body.completed?.trim() ?? '';
    const password = body.password1 ?? '';
    if (!PHONE_RE.test(phone) || password.length < 6 || password !== body.password2) {
      session.flashAlert = {
        icon: 'error',
        title: 'Không thể tạo tài khoản',
        text: 'Số điện thoại hoặc mật khẩu không hợp lệ.',
      };
      return;
    }
    if (await this.auth.findByPhone(phone)) {
      session.flashAlert = { icon: 'error', title: 'Số điện thoại đã được đăng ký' };
      return;
    }
    const user = await this.auth.register(phone, password);
    await this.signIn(session, user.id, user.phone);
    session.flashAlert = { icon: 'success', title: 'Thành công', text: 'Tạo tài khoản thành công' };
  }

  @Get('/Logout')
  @Redirect()
  logout(@Req() req: Request, @Session() session: AppSession) {
    const back = req.get('referer') ?? '/Home';
    return new Promise<{ url: string }>((resolve, reject) => {
      session.destroy((err) => (err ? reject(err) : resolve({ url: back })));
    });
  }

  /** Stores the identity and merges a guest cart into the customer's persistent cart. */
  private async signIn(session: AppSession, userId: string, phone: string) {
    session.user = phone;
    session.userId = userId;
    const guestCart = session.cart;
    if (!isCartEmpty(guestCart)) {
      for (const item of Object.values(guestCart!.items)) {
        await this.cart.addForUser(userId, item.product.id, item.quantity);
      }
    }
    const merged = await this.cart.loadForUser(userId);
    if (isCartEmpty(merged)) delete session.cart;
    else session.cart = merged;
  }
}
