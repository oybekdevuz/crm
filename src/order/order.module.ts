import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { Market } from '../market/entities/market.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, Market]), JwtModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
