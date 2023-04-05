import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString({
    message: '품명은 필수 입력값입니다.',
  })
  name: string;

  @IsNumber(null, {
    message: '경매 시작가는 필수 입력값입니다.',
  })
  startingBid: number;

  @IsDate({
    message: '경매일은 Date형식이어야 합니다.',
  })
  @Type(() => Date)
  auctionTime: Date;

  @IsString({
    message: '품목은 필수 입력값입니다.',
  })
  categoryId: string;
}
