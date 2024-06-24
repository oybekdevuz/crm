import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { Category } from '../../category/entities/category.entity';
import { Manager } from '../../manager/entities/manager.entity';
import { Casher } from '../../casher/entities/casher.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('market')
export class Market {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Admin, admin => admin.market, { eager: true })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
  
  @ManyToOne(() => Admin, admin => admin.market, { eager: true })
  @JoinColumn({ name: 'managerId' })
  manager: Manager;
  
  @ManyToOne(() => Casher, casher => casher.market, {eager: true})
  @JoinColumn({ name: 'casherId' })
  casher: Casher;

  @OneToMany(() => Category, category => category.market, {cascade: true})
  categories: Category[];

  @OneToMany(() => Product, (product) => product.market)
  products: Product[];
  
  @OneToMany(() => Order, (order) => order.market)
  orders: Order[];
}
