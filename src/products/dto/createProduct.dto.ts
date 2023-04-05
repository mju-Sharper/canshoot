import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  startingBid: number;

  @IsDate()
  @Type(() => Date)
  auctionTime: Date;

  @IsString()
  categoryId: string;
}
