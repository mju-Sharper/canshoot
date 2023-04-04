import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfiguration } from './config/typeorm.config';
import { validationSchema } from './config/validationSchema';
import { ProductsModule } from './products/products.module';

const businessModules = [AuthModule];

const libModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema,
  }),
  TypeOrmModule.forRootAsync({
    useClass: DatabaseConfiguration,
  }),
];

@Module({
  imports: [...businessModules, ...libModules, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
