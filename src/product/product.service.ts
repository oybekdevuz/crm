import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesService } from '../files/files.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Market } from '../market/entities/market.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Market) private readonly marketRepo: Repository<Market>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    private readonly fileService: FilesService) {}

  async create(createProductDto: CreateProductDto, image: any) {
    const market = await this.marketRepo.findOne({where: {id: createProductDto.marketId}, relations: ['products']});
    const category = await this.categoryRepo.findOne({where: {id: createProductDto.categoryId}, relations: ['products']});
    if (!market) throw new NotFoundException("Market not found");
    if (!category) throw new NotFoundException("Category not found");
    if(!image) throw new NotFoundException("Image not found");
    let fileName: string;
    if (image) {
      fileName = await this.fileService.createFile(image);
    }
    const isActive: boolean = createProductDto.is_active === "true";
    const product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.img = fileName;
    product.price = parseFloat(createProductDto.price);
    product.discount = parseFloat(createProductDto.discount);
    product.cost = parseFloat(createProductDto.cost);
    product.amount = createProductDto.amount;
    product.is_active = isActive;
    product.market = market;
    product.category = category;

    await this.productRepo.save(product);
    
    market.products.push(product);
    await this.marketRepo.save(market);

    product.market = undefined
    product.category = undefined
    return product;
  }

  async findAll(marketId:number) {
    const products = await this.productRepo.find({ where: { market: { id: marketId } } });
    return products;  
  }

  async findOne(id: number, marketId: number) {
    const product = await this.productRepo.findOne({ where: {id, market: { id: marketId } } });
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, image?: any) {
    try {
      const product = await this.productRepo.findOneOrFail({where: {id}});
      product.name = updateProductDto.name ?? product.name;
      product.description = updateProductDto.description ?? product.description;
      product.price = updateProductDto.price ? parseFloat(updateProductDto.price) : product.price;
      product.discount = updateProductDto.discount ? parseFloat(updateProductDto.discount) : product.discount;
      product.cost = updateProductDto.cost ? parseFloat(updateProductDto.cost) : product.cost;
      product.amount = updateProductDto.amount ?? product.amount;
      product.is_active = updateProductDto.is_active === 'true';

      if (image) {
        const fileName = await this.fileService.createFile(image);
        product.img = fileName;
        await this.fileService.deleteFile(product.img)
      }
      return this.productRepo.save(product);
    } catch (err) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  async remove(id: number) {
    const productToRemove = await this.productRepo.findOne({where: {id}});
    if (!productToRemove) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    await this.productRepo.remove(productToRemove);
    return `Product with id ${id} has been successfully removed`;
  }
}
