import { Controller, Get, Render } from '@nestjs/common';

/** Static pages that need no data from the database. */
@Controller()
export class PagesController {
  @Get(['/', '/Home'])
  @Render('web/home')
  home() {
    return {};
  }

  @Get('/admin')
  @Render('admin/login')
  adminLogin() {
    // Standalone page, not wrapped in the storefront layout.
    return { layout: false };
  }
}
