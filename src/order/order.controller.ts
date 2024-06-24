import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get('all/:marketId')
  @ApiOperation({ summary: 'Get orders filtered by market ID and date range or for today' })
  @ApiParam({ name: 'marketId', description: 'Market ID', type: Number })
  @ApiQuery({ name: 'startDate', description: 'Start date for filtering (optional)', required: false })
  @ApiQuery({ name: 'endDate', description: 'End date for filtering (optional)', required: false })
  findAll(
    @Param('marketId') marketId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.orderService.findAll(+marketId, startDate, endDate);
  }

  @Get('one/:id/:marketId')
  @ApiOperation({ summary: 'Get a single order by ID and market ID' })
  @ApiParam({ name: 'id', description: 'Order ID', type: Number })
  @ApiParam({ name: 'marketId', description: 'Market ID', type: Number })
  findOne(@Param('id') id: string, @Param('marketId') marketId: string) {
    return this.orderService.findOne(+id, +marketId);
  }
}
