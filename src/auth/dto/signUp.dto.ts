import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsString()
  id: string;

  @IsString()
  password: string;
}
