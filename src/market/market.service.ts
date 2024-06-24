import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Market } from './entities/market.entity';
import { Repository } from 'typeorm';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Market) private readonly marketRepo: Repository<Market>,
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
  ) {};
  create(createMarketDto: CreateMarketDto) {
    return this.marketRepo.save(createMarketDto);
  }

  findAll() {
    return this.marketRepo.find({relations: ['categories', 'products', 'admin']});
  }

  findOne(id: number) {
    return this.marketRepo.findOne({where: {id}, relations: ['categories', 'products', 'admin']});
  }

  async update(id: number, updateMarketDto: UpdateMarketDto) {
    const market = await this.findOne(id);
    if (!market) throw new NotFoundException('Market not found');
  
    const admin = await this.adminRepo.findOne({ where: { id: updateMarketDto.adminId } });
    if (!admin) throw new NotFoundException('Admin not found');

    market.name = updateMarketDto.name || market.name;
    market.admin = admin;
  
    return await this.marketRepo.save(market);
  }
  
    
  async remove(id: number) {
    const market = await this.findOne(id)
    if(!market) throw new NotFoundException("Market not found")
    await this.marketRepo.delete(id);
    return 'Success';
  }
}
