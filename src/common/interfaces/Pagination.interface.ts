import { PageOptionsDto } from '../dtos';

export interface IRelated {
  prev_uri: string | null;
  next_uri: string | null;
}

export interface IPageLinkDto {
  url: string;
  itemCount: number;
  pageOptionsDto: PageOptionsDto;
}

export interface IpageMetaDto {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}
