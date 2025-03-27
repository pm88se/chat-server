import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsEmailUnique } from 'src/users/decorators/is-email-unique.decorator';

export class RegisterUserRequestDto {
  @IsEmail()
  @IsEmailUnique({ message: 'This email is already registered' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  first_name: string;
}
