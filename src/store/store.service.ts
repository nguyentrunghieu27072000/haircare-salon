import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  getCategories() {
    return this.prisma.productCategory.findMany({ orderBy: { id: 'asc' } });
  }

  getProductsByCategory(categoryId: string) {
    return this.prisma.product.findMany({ where: { categoryId }, orderBy: { id: 'asc' } });
  }

  getProduct(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }
}
