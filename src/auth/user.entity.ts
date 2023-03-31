import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['userId'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

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

  @CreateDateColumn()
  createdDate: Date;
}
