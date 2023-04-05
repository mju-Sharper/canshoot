import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsString({
    message: 'id는 필수 입력값입니다.',
  })
  @MinLength(5, {
    message: 'id는 5자 이상 입력해주세요.',
  })
  @MaxLength(20, {
    message: 'id는 20자 이하로 입력해주세요.',
  })
  userId: string;

  @IsString({
    message: '비밀번호는 필수 입력값입니다.',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/, {
    message: '비밀번호 형식이 올바르지 않습니다!',
  })
  password: string;
}
