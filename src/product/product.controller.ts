import { Controller, Get, Post, Body, Put, Param, Delete, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { Roles } from '../decorator/role';
import { CheckToken } from '../guards/check-token.guard';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('admin', 'manager')
  @UseGuards(CheckToken)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        discount: { type: 'number' },
        cost: { type: 'number' },
        amount: { type: 'number' },
        is_active: { type: 'boolean' },
        marketId: { type: 'number' },
        categoryId: { type: 'number' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() image: any): Promise<Product> {
    return this.productService.create(createProductDto, image);
  }
  
  @Get('all/:marketId')
  @Roles('admin')
  @UseGuards(CheckToken)
  @ApiParam({ name: 'marketId', type: Number })
  findAll(@Param('marketId') marketId: string) {
    return this.productService.findAll(+marketId);
  }
  
  @Get('one/:id/:marketId')
  @Roles('admin')
  @UseGuards(CheckToken)
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'marketId', type: Number })
  findOne(@Param('id') id: string, @Param('marketId') marketId: string) {
    return this.productService.findOne(+id, +marketId);
  }
  
  @Put(':id')
  @Roles('admin', 'manager', 'casher')
  @UseGuards(CheckToken)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        discount: { type: 'number' },
        cost: { type: 'number' },
        amount: { type: 'number' },
        is_active: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() image: any): Promise<Product> {
    return this.productService.update(+id, updateProductDto, image);
  }

  @Delete(':id')
  @Roles('admin', 'manager')
  @UseGuards(CheckToken)
  remove(@Param('id') id: string): Promise<string> {
    return this.productService.remove(+id);
  }
}
