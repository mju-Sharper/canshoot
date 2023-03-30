import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    this.userRepository.createUser(signUpDto);
    return {
      data: '회원가입이 완료되었습니다.',
    };
  }

  async signIn(signInDto: SignInDto) {
    const { userId, password } = signInDto;
    const user = await this.userRepository.findOneBy({
      userId,
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { userId };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESSTOKEN_SECRET,
      });
      return {
        data: {
          accessToken,
        },
      };
    }
    throw new BadRequestException('로그인에 실패했습니다.');
  }
}
