import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';

import { ResponseDto } from 'src/common/dtos';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<ResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  signIn(@Body() signInDto: SignInDto): Promise<ResponseDto> {
    return this.authService.signIn(signInDto);
  }
}
