import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from 'src/auth/user.repository';
import { Product } from 'src/products/entities';
import { Repository } from 'typeorm';

import { Auction } from './auctions.entity';

@Injectable()
export class AuctionRepository {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    private readonly userRepository: UserRepository,
  ) {}

  async createAuction(product: Product, bid: number): Promise<Auction> {
    const auction = this.auctionRepository.create({
      product,
      bid,
    });

    await this.auctionRepository.save(auction);
    return auction;
  }

  async getAuctionByProductId(productId: string): Promise<Auction> {
    const targetAuction = await this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.product', 'Products')
      .where('Products.id=:productId', { productId })
      .getOne();

    if (!targetAuction) {
      throw new BadRequestException({
        error: '유효하지 않은 상품입니다.',
      });
    }

    return targetAuction;
  }

  async updateBid(bid: number, userId: string, productId: string) {
    const user = await this.userRepository.findUserById(userId);

    const targetAuction = await this.getAuctionByProductId(productId);

    if (targetAuction.bid >= bid) {
      throw new BadRequestException({
        error: '현재 입찰가와 같거나 낮은 금액으로 입찰할 수 없습니다.',
      });
    }

    const updatedAuction = {
      id: targetAuction.id,
      bid,
      bidder: user,
    };

    this.auctionRepository.save(updatedAuction);

    return {
      bid,
      bidder: user.userId,
    };
  }
}
