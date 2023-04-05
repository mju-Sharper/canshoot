import { Type } from 'class-transformer';
import { IsNumber, IsString, IsDate } from 'class-validator';

export class UpdateProductDto {
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
