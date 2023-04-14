import { AbstractEntity } from 'src/common/entities';
import { Product } from 'src/products/entities';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

@Entity({ name: 'User' })
@Unique(['userId'])
export class User extends AbstractEntity {
  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  userId: string;

  @Column()
  password: string;

  @Column({
    type: 'int',
    default: 10000,
  })
  point = 10000;

  @OneToMany(() => Product, (products) => products.seller)
  products: Product[];
}
