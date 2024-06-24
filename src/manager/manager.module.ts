import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity';
import { Market } from '../market/entities/market.entity';
import { TokensModule } from '../tokens/tokens.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Manager, Market]), TokensModule, JwtModule],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
