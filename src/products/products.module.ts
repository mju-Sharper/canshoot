import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';

import { Product } from './entities';
import { ProductsController } from './products.controller';
import { ProductRepository } from './products.repository';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), forwardRef(() => AuthModule)],
  providers: [ProductsService, ProductRepository],
  controllers: [ProductsController],
  exports: [ProductsService, ProductRepository],
})
export class ProductsModule {}
