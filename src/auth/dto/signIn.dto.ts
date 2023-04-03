import { IsString, Matches, Max, Min } from 'class-validator';

export class SignInDto {
  @IsString()
  @Min(5)
  @Max(20)
  userId: string;

  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: '비밀번호 형식이 올바르지 않습니다!',
  })
  password: string;
}
