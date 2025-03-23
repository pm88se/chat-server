import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserRequestDto } from './dto/register-user-request-dto';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (user?.password_hash !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: RegisterUserRequestDto): Promise<any> {
    const password_hash = await this.usersService.hashPassword(
      signUpDto.password,
    );

    const createUserDto: CreateUserDto = {
      email: signUpDto.email,
      password_hash,
      first_name: signUpDto.first_name,
      last_name: signUpDto.last_name,
    };

    const user = await this.usersService.create(createUserDto);

    const result = omit(user, ['password_hash']);

    return result;
  }
}
