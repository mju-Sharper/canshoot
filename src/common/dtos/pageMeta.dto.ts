import { IpageMetaDto } from '../interfaces';

export class PageMetaDto {
  page: number;

  take: number;

  itemCount: number;

  pageCount: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: IpageMetaDto) {
    const { page, take } = pageOptionsDto;
    this.page = page;
    this.take = take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(itemCount / take);
    this.hasPreviousPage = page > 1 && page <= this.pageCount;
    this.hasNextPage = page >= 1 && page < this.pageCount;
  }
}
