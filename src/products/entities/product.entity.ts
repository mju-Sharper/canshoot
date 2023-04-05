import { User } from 'src/auth/user.entity';
import { AbstractEntity } from 'src/common/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column()
  categoryId: string;

  @Column()
  sellerId: string;

  @ManyToOne(() => Category, (category) => category.products, { eager: false })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @ManyToOne(() => User, (user) => user.products, { eager: false })
  @JoinColumn({ name: 'sellerId', referencedColumnName: 'id' })
  seller: User;
}
