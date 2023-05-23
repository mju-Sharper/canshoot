import { IRelated, IPageLinkDto } from '../interfaces';

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
        page > 1 && page <= totalPage
          ? returnUrl.replace(`page=${page}`, `page=${page - 1}`)
          : null,
      next_uri:
        page >= 1 && page < totalPage
          ? returnUrl.replace(`page=${page}`, `page=${page + 1}`)
          : null,
    };
  }
}
