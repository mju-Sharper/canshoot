import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  userId: string;

  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/, {
    message: '비밀번호 형식이 올바르지 않습니다!',
  })
  password: string;
}
