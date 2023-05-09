import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from 'src/auth/user.repository';
import { Product } from 'src/products/entities';
import { Repository, UpdateResult } from 'typeorm';

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

  async handleBid(
    bid: number,
    userId: string,
    productId: string,
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findUserById(userId);

    const updatedAuction = await this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.productId', 'Products')
      .where('auction.productId=:productId', { productId })
      .update()
      .set({
        bid,
        bidder: user,
      })
      .execute();

    return updatedAuction;
  }
}
