import { PageOptionsDto } from '.';

interface IpageMetaDto {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

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
    this.hasPreviousPage = page > 1;
    this.hasNextPage = page < this.pageCount;
  }
}
