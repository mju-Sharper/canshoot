import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWT_ACCESS_TOKEN_SECRET_KEY } from 'src/common/consts';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>(JWT_ACCESS_TOKEN_SECRET_KEY),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload): Promise<User> {
    const { userId } = payload;
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    if (!user) {
      throw new UnauthorizedException({
        error: '로그인이 필요한 서비스입니다.',
      });
    }

    return user;
  }
}
