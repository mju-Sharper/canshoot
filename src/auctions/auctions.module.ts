import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';

import { AuctionsController } from './auctions.controller';
import { Auction } from './auctions.entity';
import { AuctionRepository } from './auctions.repository';
import { AuctionsService } from './auctions.service';
import { AuctionsInfo } from './auctionsInfo.helpers';

@Module({
  imports: [TypeOrmModule.forFeature([Auction]), AuthModule, LoggerModule],
  controllers: [AuctionsController],
  providers: [AuctionRepository, AuctionsService, AuctionsInfo],
  exports: [AuctionRepository, AuctionsService, AuctionsInfo],
})
export class AuctionsModule {}
