import { Module } from '@nestjs/common';

import { AuctionsModule } from 'src/auctions/auctions.module';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ProductsModule } from 'src/products/products.module';

import { EventsGateway } from './events.gateway';

@Module({
  imports: [AuthModule, ProductsModule, LoggerModule, AuctionsModule],
  providers: [EventsGateway],
})
export class EventsModule {}
