import { Module } from '@nestjs/common';
import { CasherService } from './casher.service';
import { CasherController } from './casher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Casher } from './entities/casher.entity';
import { Market } from '../market/entities/market.entity';
import { JwtModule } from '@nestjs/jwt';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([Casher, Market]), JwtModule, TokensModule],
  controllers: [CasherController],
  providers: [CasherService],
})
export class CasherModule {}
