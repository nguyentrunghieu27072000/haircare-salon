import type { NextFunction, Request, Response } from 'express';

const CART_PAGES = ['/Store', '/collections', '/product-details', '/Shooping-Cart'];

/**
 * Exposes session state to every template (layouts/main.hbs reads these).
 * Flash alerts are shown once, then removed from the session.
 */
export function viewLocals(req: Request, res: Response, next: NextFunction) {
  const session = req.session;
  res.locals.currentUser = session.user;
  res.locals.cart = session.cart;
  res.locals.showCart = CART_PAGES.includes(req.path);
  if (session.flashAlert) {
    res.locals.flashAlert = session.flashAlert;
    delete session.flashAlert;
  }
  next();
}
