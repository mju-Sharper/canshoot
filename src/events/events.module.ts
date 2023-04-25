import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';

import { EventsGateway } from './events.gateway';

@Module({
  imports: [AuthModule, ProductsModule],
  providers: [EventsGateway],
})
export class EventsModule {}
