import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Market } from '../market/entities/market.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Market) private readonly marketRepo: Repository<Market>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const market = await this.marketRepo.findOne({where: {id:createCategoryDto.marketId}, relations: ['categories']});
    if (!market) {
      throw new NotFoundException('Market not found');
    }

    const category = this.categoryRepo.create({
      ...createCategoryDto,
    });
    
     await this.categoryRepo.save(category);
    market.categories.push(category);
    await this.marketRepo.save(market);
    return category;
  }

  async findAll(marketId: number) {
    const categories = await this.categoryRepo.find({ where: { market: { id: marketId } } });
    return categories;
  }

  async findOne(id: number, marketId: number) {
    const category = await this.categoryRepo.findOne({ where: {id, market: { id: marketId } } });
    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepo.update({id}, {...updateCategoryDto});
  }

  async remove(id: number) {
    await this.categoryRepo.delete(id)
    return 'Success';
  }
}
