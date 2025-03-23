import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { RegisterUserRequestDto } from './dto/register-user-request-dto';
import { User } from 'src/database/core/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUsersService = {
      findOne: jest.fn(),
      create: jest.fn(),
      hashPassword: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access_token if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = '123456';
      const user: User = { id: 1, email, password_hash: password } as User;

      usersService.findOne.mockResolvedValue(user);
      jwtService.signAsync.mockResolvedValue('mocked-token');

      const result = await service.signIn(email, password);

      expect(usersService.findOne).toHaveBeenCalledWith(email);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email,
      });
      expect(result).toEqual({ access_token: 'mocked-token' });
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrong';
      const user: User = { id: 1, email, password_hash: 'correct' } as User;

      usersService.findOne.mockResolvedValue(user);

      await expect(service.signIn(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      usersService.findOne.mockResolvedValue(null);

      await expect(
        service.signIn('no-user@example.com', '123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should create a user and return it without password_hash', async () => {
      const dto: RegisterUserRequestDto = {
        email: 'new@example.com',
        password: 'pass123',
        first_name: 'John',
        last_name: 'Doe',
      };

      const hashedPassword = 'hashed';
      const savedUser = {
        id: 1,
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
        password_hash: hashedPassword,
        is_active: true,
      } as User;

      usersService.hashPassword.mockResolvedValue(hashedPassword);
      usersService.create.mockResolvedValue(savedUser);

      const result = await service.signUp(dto);

      expect(usersService.hashPassword).toHaveBeenCalledWith(dto.password);
      expect(usersService.create).toHaveBeenCalledWith({
        email: dto.email,
        password_hash: hashedPassword,
        first_name: dto.first_name,
        last_name: dto.last_name,
      });

      expect(result).toEqual({
        id: 1,
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
        is_active: true,
      });
    });
  });
});
