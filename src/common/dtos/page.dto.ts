import { PageLinkDto, PageMetaDto } from '.';

export class PageDto<T> {
  data: T[];

  meta: PageMetaDto;

  links: PageLinkDto;

  constructor(data: T[], meta: PageMetaDto, links: PageLinkDto) {
    this.data = data;
    this.meta = meta;
    this.links = links;
  }
}
