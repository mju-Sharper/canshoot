import { Injectable } from '@nestjs/common';

import { ResponseDto } from 'src/common/dtos';

import { AuctionRepository } from './auctions.repository';

@Injectable()
export class AuctionsService {
  constructor(private auctionRepository: AuctionRepository) {}

  async getBid(productId: string): Promise<ResponseDto<number>> {
    const { bid } = await this.auctionRepository.getAuctionByProductId(
      productId,
    );
    return new ResponseDto(`현재 입찰가는 ${bid}원입니다.`, {
      bid,
    });
  }
}
