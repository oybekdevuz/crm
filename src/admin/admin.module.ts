import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { TokensModule } from '../tokens/tokens.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), TokensModule, JwtModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
