import { Controller } from '@nestjs/common';
import { Body, Param, Post, Get, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';

import { GetUserId } from 'src/common/decorators';
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

  @UseGuards(AuthGuard())
  @Get('admin/:id')
  isaAdmin(
    @Param('id') productId: string,
    @GetUserId() userId: string,
  ): Promise<ResponseDto<boolean>> {
    return this.authService.isAdmin(productId, userId);
  }
}
