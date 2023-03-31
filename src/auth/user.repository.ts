import { BadRequestException, HttpException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { CustomRepository } from 'src/util/repository.decorator';
import { Repository } from 'typeorm';

import { SignUpDto } from './dto/signUp.dto';
import { User } from './user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(signUpDto: SignUpDto) {
    const { userId, name, password, phone, email } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      phone,
      name,
      userId,
      password: hashedPassword,
      email,
    });

    try {
      await this.save(user);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('이미 존재하는 아이디입니다.');
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

  async findUserById(userId: string): Promise<User> {
    const user = await this.findOneBy({
      userId,
    });

    if (!user) {
      throw new BadRequestException('존재하지 않는 아이디입니다.');
    }

    return user;
  }
}
