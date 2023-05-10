import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';

import { Auction } from './auctions.entity';
import { AuctionRepository } from './auctions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Auction]), AuthModule],
  providers: [AuctionRepository],
  exports: [AuctionRepository],
})
export class AuctionsModule {}
