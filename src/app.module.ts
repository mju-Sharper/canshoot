import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import authConfig from './config/auth.config';
import typeormConfig from './config/typeorm.config';
import { validationSchema } from './config/validationSchema';

const businessModules = [];

const libModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [typeormConfig, authConfig],
    validationSchema,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [typeormConfig.KEY],
    useFactory: (config: ConfigType<typeof typeormConfig>) => ({
      type: 'mysql',
      host: config.host,
      port: +config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: true,
      autoLoadEntities: true,
    }),
  }),
];

@Module({
  imports: [...businessModules, ...libModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
