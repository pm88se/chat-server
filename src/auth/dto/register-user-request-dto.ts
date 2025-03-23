import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserRequestDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  first_name: string;
}
