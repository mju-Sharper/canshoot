import { IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class SignUpDto {
  @IsString({
    message: '휴대폰 번호는 필수 입력값입니다.',
  })
  @Matches(/\d{3}\d{4}\d{4}/, {
    message: '휴대폰 번호 형식이 올바르지 않습니다.',
  })
  phone: string;

  @IsString({
    message: '이메일은 필수 입력값입니다.',
  })
  @Matches(
    /^[0-9a-zA-Z-_]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
    {
      message: '이메일 형식이 올바르지 않습니다.',
    },
  )
  email: string;

  @IsString({
    message: 'id는 필수 입력값입니다.',
  })
  @MinLength(5, {
    message: 'id는 5자 이상 입력해주세요',
  })
  @MaxLength(20, {
    message: 'id는 20자 이하로 입력해주세요.',
  })
  userId: string;

  @IsString({
    message: '비밀번호는 필수 입력값입니다.',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/, {
    message: '비밀번호 형식이 올바르지 않습니다.',
  })
  password: string;
}
