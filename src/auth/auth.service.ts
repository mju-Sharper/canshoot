import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt-nodejs';
import { ResponseDto } from 'src/common/dtos';
import { ProductsService } from 'src/products/products.service';

import { SignInDto, SignUpDto } from './dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly productService: ProductsService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<ResponseDto<string>> {
    await this.userRepository.createUser(signUpDto);
    return new ResponseDto('회원가입에 성공했습니다.');
  }

  async signIn(signInDto: SignInDto): Promise<ResponseDto<string>> {
    const { userId, password } = signInDto;
    const user = await this.userRepository.findUserById(userId);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException({ error: '비밀번호가 일치하지 않습니다.' });
    }

    const payload = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESSTOKEN_SECRET,
    });
    return new ResponseDto('로그인에 성공했습니다.', { accessToken });
  }

  async isAdmin(
    productId: string,
    userId: string,
  ): Promise<ResponseDto<boolean>> {
    await this.productService.getProductById(productId);
    const result = await this.userRepository.isAdmin(productId, userId);

    return new ResponseDto('요청에 성공했습니다.', { isAdmin: result });
  }
}
