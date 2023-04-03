import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @Matches(/\d{3}\d{4}\d{4}/)
  phone: string;

  @IsString()
  @IsEmail()
  email: string;

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
