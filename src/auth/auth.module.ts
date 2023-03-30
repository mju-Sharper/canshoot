import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmExModule } from 'src/util/typeormex.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.startegy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESSTOKEN_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],
  providers: [AuthService, JwtStrategy, JwtService],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtStrategy,
    JwtService,
    TypeOrmExModule,
    TypeOrmModule,
  ],
})
export class AuthModule {}
