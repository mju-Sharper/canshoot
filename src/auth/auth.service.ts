import { Injectable } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';

import { SignUpDto } from './dto/signUp.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signUp(signUpDto: SignUpDto) {
    this.userRepository.createUser(signUpDto);
    return {
      data: '회원가입이 완료되었습니다.',
    };
  }
}
