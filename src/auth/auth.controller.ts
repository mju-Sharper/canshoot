import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';

import { ResponseDto } from 'src/common/dtos';

import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<ResponseDto<string>> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  signIn(@Body() signInDto: SignInDto): Promise<ResponseDto<string>> {
    return this.authService.signIn(signInDto);
  }
}
