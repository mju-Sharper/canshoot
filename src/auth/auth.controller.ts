import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';

import { AuthService } from './auth.service';
import { ResponseDto } from './dto/response.dto';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() signUpDto: SignUpDto): Promise<ResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signIn')
  signIn(@Body() signInDto: SignInDto): Promise<ResponseDto> {
    return this.authService.signIn(signInDto);
  }
}
