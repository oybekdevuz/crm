import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { And, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Market } from '../market/entities/market.entity';

@Injectable()
export class OrderService {
constructor(
  @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  @InjectRepository(Market) private readonly marketRepo: Repository<Market>,
) {}

  async create(createOrderDto: CreateOrderDto) {
  const market = await this.marketRepo.findOne({
    where: { id: createOrderDto.marketId },
    relations: ['orders'],
  });

  if (!market) {
    throw new NotFoundException('Market not found');
  }

  const { products } = createOrderDto;
  let totalPrice = 0;
  const orderedProducts: Product[] = [];

  for (const productItem of products) {
    const product = await this.productRepo.findOne({
      where: { id: productItem.productId },
    });

    if (!product) {
      throw new NotFoundException(`Product not found with id ${productItem.productId}`);
    }

    if (product.amount < productItem.count) {
      throw new BadRequestException(`Not enough stock for product id ${productItem.productId}`);
    }

    const productPrice = product.price * productItem.count;
    totalPrice += productPrice;

    product.amount -= productItem.count;
    await this.productRepo.save(product);

    orderedProducts.push(product);
  }

  const order = this.orderRepo.create({
    products: orderedProducts,
    price: totalPrice,
    market: market,
  });

  await this.orderRepo.save(order);
  order.market = undefined;
  return {totalPrice, orderedProducts};
  }

  async findAll(marketId: number, startDate: string, endDate: string) {
  let orders: Order[];

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    orders = await this.orderRepo.find({
      where: {
        market: { id: marketId },
        createAt: And(
          MoreThanOrEqual(start),
          LessThanOrEqual(end)
        ),
      },
    });
  } else {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    orders = await this.orderRepo.find({
      where: {
        market: { id: marketId },
        createAt: And(
          MoreThanOrEqual(new Date(today.getFullYear(), today.getMonth(), today.getDate())),
          LessThanOrEqual(new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()))
        ),
      },
    });
  }

  return orders;
  }

  async findOne(id: number, marketId: number) {
    const order = await this.productRepo.findOne({ where: {id, market: { id: marketId } } });
    return order;
  }


}
