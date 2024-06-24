import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { MarketService } from './market.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../decorator/role';
import { CheckToken } from '../guards/check-token.guard';

@ApiTags('market') 
@Controller('market')
@Roles('super_admin')
@UseGuards(CheckToken)
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new market' })
  @ApiBody({ type: CreateMarketDto })
  @ApiResponse({ status: 201, description: 'Returns the created market' })
  create(@Body() createMarketDto: CreateMarketDto) {
    return this.marketService.create(createMarketDto);
  }
  
  @Get()
  @ApiOperation({ summary: 'Get all markets' })
  @ApiResponse({ status: 200, description: 'Returns an array of markets' })
  findAll() {
    return this.marketService.findAll();
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Get a market by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the market with the specified ID' })
  findOne(@Param('id') id: string) {
    return this.marketService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a market by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateMarketDto })
  @ApiResponse({ status: 200, description: 'Returns the updated market' })
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketService.update(+id, updateMarketDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a market by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Returns success upon successful deletion' })
  remove(@Param('id') id: string) {
    return this.marketService.remove(+id);
  }
}
