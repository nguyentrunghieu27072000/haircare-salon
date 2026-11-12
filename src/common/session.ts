import type { Session, SessionData } from 'express-session';
import type { Cart } from '../cart/cart.types.js';

export interface FlashAlert {
  icon: 'success' | 'error' | 'warning' | 'info';
  title: string;
  text?: string;
}

declare module 'express-session' {
  interface SessionData {
    /** Phone number of the logged-in customer (shown in the navbar). */
    user?: string;
    userId?: string;
    cart?: Cart;
    flashAlert?: FlashAlert;
  }
}

export type AppSession = Session & Partial<SessionData>;
