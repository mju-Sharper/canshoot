import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';

import { AuctionsController } from './auctions.controller';
import { Auction } from './auctions.entity';
import { AuctionRepository } from './auctions.repository';
import { AuctionsService } from './auctions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auction]), AuthModule],
  controllers: [AuctionsController],
  providers: [AuctionRepository, AuctionsService],
  exports: [AuctionRepository, AuctionsService],
})
export class AuctionsModule {}
