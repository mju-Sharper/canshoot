import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { Category } from 'src/common/enums';

export class CreateProductDto {
  @IsString({
    message: '품명은 필수 입력값입니다.',
  })
  name: string;

  @Type(() => Number)
  startingBid: number;

  @IsDate({
    message: '경매일은 Date형식이어야 합니다.',
  })
  @Type(() => Date)
  auctionTime: Date;

  @IsEnum(Category, {
    message: '유효하지 않은 카테고리입니다.',
  })
  category: Category;
}
