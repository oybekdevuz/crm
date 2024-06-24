import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Market } from '../../market/entities/market.entity';

@Entity("order")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product, (product) => product.order)
  products: Product[];

  @ManyToOne(() => Market, market => market.orders)
  market: Market;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  price: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date

}
