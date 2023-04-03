import { Exclude } from 'class-transformer';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  public id: string;

  @CreateDateColumn()
  @Exclude()
  public createdAt: Date;
}
