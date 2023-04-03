import { AbstractEntity } from 'src/common/entities';
import { Column, Entity, Unique } from 'typeorm';

@Entity({ name: 'user' })
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
}
