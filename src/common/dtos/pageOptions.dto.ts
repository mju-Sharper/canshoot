import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import { Order } from '../consts';
import { Category } from '../enums';

export class PageOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  order?: Order = Order.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  take?: number = 3;

  @IsOptional()
  search?: string = '';

  @IsOptional()
  @IsArray()
  @IsEnum(Category, { each: true })
  @Transform(({ value }) => value.split(','))
  category?: Category[] = Object.values(Category);

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
