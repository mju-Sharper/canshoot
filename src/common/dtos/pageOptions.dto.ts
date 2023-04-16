import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import { Order } from '../consts';
import { Category } from '../enums';

export class PageOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  order?: Order;

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

  @IsEnum(Category)
  @IsOptional()
  category?: Category;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
