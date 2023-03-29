import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.startegy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const businessModules = [];

const libModules = [
  JwtModule.register({
    secret: process.env.JWT_ACCESSTOKEN_SECRET,
    signOptions: {
      expiresIn: 3600,
    },
  }),
  PassportModule.register({
    defaultStrategy: 'jwt',
  }),
  TypeOrmModule.forFeature([User]),
];

@Module({
  imports: [...businessModules, ...libModules],
  providers: [AuthService, JwtStrategy, UserRepository],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
