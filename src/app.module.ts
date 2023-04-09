import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { DatabaseConfiguration } from './config/typeorm.config';
import { validationSchema } from './config/validationSchema';
import { ProductsModule } from './products/products.module';

const businessModules = [AuthModule, ProductsModule];

const libModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema,
  }),
  TypeOrmModule.forRootAsync({
    useClass: DatabaseConfiguration,
  }),
  AwsModule.forRoot({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }),
];

@Module({
  imports: [...businessModules, ...libModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
