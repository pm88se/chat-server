import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserRequestDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
