import { User } from 'src/auth/user.entity';
import { AbstractEntity } from 'src/common/entities';
import { Category } from 'src/common/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Products' })
export class Product extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  startingBid: number;

  @Column()
  imageUrl: string;

  @Column()
  auctionTime: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  sellerId: string;

  @Column()
  category: Category;

  @ManyToOne(() => User, (user) => user.products, { eager: false })
  @JoinColumn({ name: 'sellerId', referencedColumnName: 'id' })
  seller: User;
}
