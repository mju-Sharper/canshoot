import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auction } from 'src/auctions/auctions.entity';
import { AuctionsModule } from 'src/auctions/auctions.module';
import { AuctionRepository } from 'src/auctions/auctions.repository';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';

import { Product } from './entities';
import { ProductsController } from './products.controller';
import { ProductRepository } from './products.repository';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Auction]),
    forwardRef(() => AuthModule),
    AuctionsModule,
    LoggerModule,
  ],
  providers: [ProductsService, ProductRepository, AuctionRepository],
  controllers: [ProductsController],
  exports: [ProductsService, ProductRepository],
})
export class ProductsModule {}
