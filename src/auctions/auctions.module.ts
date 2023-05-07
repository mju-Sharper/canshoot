import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auction } from './auctions.entity';
import { AuctionRepository } from './auctions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Auction])],
  providers: [AuctionRepository],
  exports: [AuctionRepository],
})
export class AuctionsModule {}
