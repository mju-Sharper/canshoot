import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { typeORMConfig } from './config/typeorm.config';
import { validationSchema } from './config/validationSchema';

const businessModules = [];

const libModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema,
  }),
  TypeOrmModule.forRoot(typeORMConfig),
];

@Module({
  imports: [...businessModules, ...libModules, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
