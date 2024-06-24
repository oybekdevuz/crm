import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Market } from '../../market/entities/market.entity';
import { Product } from '../../product/entities/product.entity';

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => Market, market => market.categories)
  market: Market;

  @OneToMany(() => Product, product => product.category, {cascade: true})
  products: Product[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date

}
