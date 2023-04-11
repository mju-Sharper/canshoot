import { Type } from 'class-transformer';
import { IsEnum, IsDate, IsOptional, IsString } from 'class-validator';
import { Category } from 'src/common/enums';

export class UpdateProductDto {
  @IsOptional()
  @IsString({
    message: '품명은 필수 입력값입니다.',
  })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  startingBid?: number;

  @IsOptional()
  @IsDate({
    message: '경매일은 Date형식이어야 합니다.',
  })
  @Type(() => Date)
  auctionTime?: Date;

  @IsOptional()
  imageUrl: string;

  @IsOptional()
  @IsEnum(Category, {
    message: '유효하지 않은 카테고리입니다.',
  })
  category?: Category;
}
