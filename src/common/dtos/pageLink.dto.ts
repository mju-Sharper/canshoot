import { PageOptionsDto } from '.';

interface IRelated {
  prev_uri: string | null;
  next_uri: string | null;
}

interface IPageLinkDto {
  url: string;
  itemCount: number;
  pageOptionsDto: PageOptionsDto;
}

export class PageLinkDto {
  self: string;

  related: IRelated;

  constructor({ url, itemCount, pageOptionsDto }: IPageLinkDto) {
    const { page, take } = pageOptionsDto;
    const totalPage = Math.ceil(itemCount / take);

    const returnUrl = url.includes('page')
      ? url
      : url.includes('?')
      ? url.concat('&page=1')
      : url.concat('?page=1');

    this.self = url;
    this.related = {
      prev_uri:
        page > 1 ? returnUrl.replace(`page=${page}`, `page=${page - 1}`) : null,
      next_uri:
        page === totalPage
          ? null
          : returnUrl.replace(`page=${page}`, `page=${page + 1}`),
    };
  }
}
