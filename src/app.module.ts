import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { PagesModule } from './pages/pages.module.js';
import { BookingModule } from './booking/booking.module.js';
import { StoreModule } from './store/store.module.js';
import { CartModule } from './cart/cart.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    // Loads .env into process.env before PrismaClient reads DATABASE_URL.
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PagesModule,
    BookingModule,
    StoreModule,
    CartModule,
    AuthModule,
  ],
})
export class AppModule {}
