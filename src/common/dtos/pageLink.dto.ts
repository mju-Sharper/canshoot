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
    const decodedUrl = decodeURIComponent(url);

    const returnUrl = decodedUrl.includes('page')
      ? decodedUrl
      : decodedUrl.includes('?')
      ? decodedUrl.concat('&page=1')
      : decodedUrl.concat('?page=1');

    this.self = decodedUrl;
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
