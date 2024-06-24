import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../decorator/role';
import { CheckToken } from '../guards/check-token.guard';

@ApiTags('category') 
@Controller('category')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles('admin', 'manager')
  @UseGuards(CheckToken)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Returns the created category' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
  
  @Get('all/:marketId')
  @Roles('admin')
  @UseGuards(CheckToken)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiParam({ name: 'marketId', type: Number })
  @ApiResponse({ status: 200, description: 'Returns an array of categories' })
  findAll(@Param('marketId') marketId: string) {
    return this.categoryService.findAll(+marketId);
  }
  
  @Get('one/:id/:marketId')
  @Roles('admin')
  @UseGuards(CheckToken)
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'marketId', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the category with the specified ID' })
  findOne(@Param('id') id: string, @Param('marketId') marketId: string) {
    return this.categoryService.findOne(+id, +marketId);
  }
  
  @Put(':id')
  @Roles('admin', 'manager')
  @UseGuards(CheckToken)
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Returns the updated category' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }
  
  @Delete(':id')
  @Roles('admin', 'manager')
  @UseGuards(CheckToken)
  @ApiOperation({ summary: 'Remove a category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Returns success upon successful deletion' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
