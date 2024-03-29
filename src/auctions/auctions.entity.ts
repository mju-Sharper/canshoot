import { User } from 'src/auth/user.entity';
import { AbstractEntity } from 'src/common/entities';
import { Product } from 'src/products/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Auctions' })
export class Auction extends AbstractEntity {
  @Column()
  bid: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Product, (product) => product.auction, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  product: Product;

  @Column({
    nullable: true,
  })
  bidderId: string;

  @ManyToOne(() => User, (user) => user.auctions, {
    nullable: true,
  })
  @JoinColumn({ name: 'bidderId', referencedColumnName: 'id' })
  bidder: User;
}
