import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Market } from '../../market/entities/market.entity';
import { Category } from '../../category/entities/category.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('product')
export class Product {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Market, market => market.products)
  market: Market;

  @ManyToOne(() => Order, ordeer => ordeer.products)
  order: Order;

  @Column({ nullable: false })
  name: string;
  
  @Column({ nullable: true })
  description: string;
  
  @Column({ nullable: true })
  img: string;
  
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  price: number;
  
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  discount: number;
  
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  cost: number;
  
  @Column({ nullable: false })
  amount: number;

  @ManyToOne(() => Category, category => category.products)
  category: Category;
  
  @Column({ default: true })
  is_active: boolean;

}
