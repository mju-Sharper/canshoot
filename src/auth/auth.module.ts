import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JWT_ACCESS_TOKEN_SECRET_KEY } from 'src/common/consts';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.startegy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>(JWT_ACCESS_TOKEN_SECRET_KEY),
        signOptions: {
          expiresIn: 3600 * 24,
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtService,
    ConfigService,
    UserRepository,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtStrategy,
    JwtService,
    TypeOrmModule,
    ConfigModule,
    UserRepository,
    PassportModule,
  ],
})
export class AuthModule {}
