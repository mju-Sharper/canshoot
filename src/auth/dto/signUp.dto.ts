import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  userId: string;

  @IsString()
  password: string;
}
