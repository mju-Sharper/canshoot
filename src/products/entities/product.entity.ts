import { User } from 'src/auth/user.entity';
import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';

import { Category } from './category.entity';

@Entity({ name: 'Products' })
export class Product extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  startingBid: number;

  @Column()
  auctionTime: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => User, (user) => user.products)
  seller: User;
}
