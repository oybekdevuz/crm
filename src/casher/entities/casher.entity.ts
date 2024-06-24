import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Market } from '../../market/entities/market.entity';

@Entity("manager")
export class Casher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phone: string;

  @OneToMany(() => Market, market => market.casher)
  market: Market;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date

}
