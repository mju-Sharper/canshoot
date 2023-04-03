import { IsEmail, IsString, Matches, Min, Max } from 'class-validator';

export class SignUpDto {
  @IsString()
  @Matches(/\d{3}\d{4}\d{4}/)
  phone: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Min(5)
  @Max(20)
  userId: string;

  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: '비밀번호는 최소 6자 이상의 문자와 숫자의 조합이어야 합니다.',
  })
  password: string;
}
