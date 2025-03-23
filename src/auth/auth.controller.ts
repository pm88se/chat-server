import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserRequestDto } from './dto/login-user-request-dto';
import { RegisterUserRequestDto } from './dto/register-user-request-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  signIn(@Body() signInDto: LoginUserRequestDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
  @Post('register')
  signUp(@Body() signUpDto: RegisterUserRequestDto) {
    return this.authService.signUp(signUpDto);
  }
}
