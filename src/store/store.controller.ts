import { Controller, Get, NotFoundException, Query, Render } from '@nestjs/common';
import { isObjectId, ObjectIdPipe } from '../common/object-id.pipe.js';
import { StoreService } from './store.service.js';

@Controller()
export class StoreController {
  constructor(private readonly store: StoreService) {}

  @Get('/Store')
  @Render('web/store')
  async index() {
    return { categories: await this.store.getCategories() };
  }

  @Get('/collections')
  @Render('web/collections')
  async collections(@Query('sp') categoryId?: string) {
    const products = isObjectId(categoryId) ? await this.store.getProductsByCategory(categoryId) : [];
    return { products };
  }

  @Get('/product-details')
  @Render('web/product-detail')
  async details(@Query('id', ObjectIdPipe) id: string) {
    const product = await this.store.getProduct(id);
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return { product };
  }
}
