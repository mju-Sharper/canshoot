import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { SignUpDto } from './dto/signUp.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(signUpDto: SignUpDto) {
    const { id, name, password, phone, email } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      phone,
      name,
      id,
      password: hashedPassword,
      email,
    });

    try {
      await this.userRepository.save(user);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException({
          error: '이미 있는 아이디입니다.',
        });
      } else {
        throw new HttpException(
          {
            error: '잠시후 다시 시도해주세요.',
          },
          500,
        );
      }
    }

    return 'signIn';
  }
}
