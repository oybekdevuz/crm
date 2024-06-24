import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { JwtModule } from '@nestjs/jwt';
import { Admin } from '../admin/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Market, Admin]), JwtModule],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
