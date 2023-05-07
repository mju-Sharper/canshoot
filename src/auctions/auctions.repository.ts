import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from 'src/products/entities';
import { Repository } from 'typeorm';

import { Auction } from './auctions.entity';

@Injectable()
export class AuctionRepository {
  constructor(
    @InjectRepository(Auction)
    private readonly userRepository: Repository<Auction>,
  ) {}

  async createAuction(product: Product, bid: number): Promise<Auction> {
    const auction = this.userRepository.create({
      product,
      bid,
    });

    await this.userRepository.save(auction);
    return auction;
  }
}
