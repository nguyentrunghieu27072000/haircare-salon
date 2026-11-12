import { Module } from '@nestjs/common';
import { CartModule } from '../cart/cart.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [CartModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
