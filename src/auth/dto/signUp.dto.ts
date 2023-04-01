import { IsEmail, IsString, Matches, Min } from 'class-validator';

export class SignUpDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/\d{3}\d{4}\d{4}/)
  phone: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Min(4)
  userId: string;

  @IsString()
  @Matches(/^[A-Za-z0-9]{6,}$/, {
    message: '비밀번호는 최소 6자 이상의 문자와 숫자의 조합이어야 합니다.',
  })
  password: string;
}
