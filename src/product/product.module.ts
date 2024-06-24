import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FilesModule } from '../files/files.module';
import { Market } from '../market/entities/market.entity';
import { Category } from '../category/entities/category.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Market, Category]), FilesModule, JwtModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
