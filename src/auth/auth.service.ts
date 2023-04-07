import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { ResponseDto } from 'src/common/dtos';

import { SignInDto, SignUpDto } from './dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<ResponseDto<string>> {
    await this.userRepository.createUser(signUpDto);
    return new ResponseDto('회원가입에 성공했습니다.');
  }

  async signIn(signInDto: SignInDto): Promise<ResponseDto<string>> {
    const { userId, password } = signInDto;
    const user = await this.userRepository.findUserById(userId);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException({ error: '비밀번호가 일치하지 않습니다.' });
    }

    const payload = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESSTOKEN_SECRET,
    });
    return new ResponseDto('로그인에 성공했습니다.', { accessToken });
  }
}
