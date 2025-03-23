import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../database/core/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepo = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { email: 'user1@example.com' },
        { email: 'user2@example.com' },
      ] as User[];
      repo.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      const findSpy = jest.spyOn(repo, 'find');
      await service.findAll();
      expect(findSpy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by email', async () => {
      const user = { email: 'test@example.com' } as User;
      repo.findOneBy.mockResolvedValue(user);

      const result = await service.findOne('test@example.com');
      expect(result).toEqual(user);
      expect(repo.findOneBy).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  describe('hashPassword', () => {
    it('should return hashed password', async () => {
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue('hashed123' as never);

      const result = await service.hashPassword('plain123');
      expect(result).toBe('hashed123');
      expect(hashSpy).toHaveBeenCalledWith('plain123', 10);
    });
  });

  describe('remove', () => {
    it('should call delete with the given id', async () => {
      repo.delete.mockResolvedValue({} as DeleteResult);

      await service.remove(5);
      expect(repo.delete).toHaveBeenCalledWith(5);
    });
  });

  describe('create', () => {
    it('should save a new user', async () => {
      const dto = {
        email: 'new@example.com',
        first_name: 'John',
        last_name: 'Doe',
        password_hash: 'hashedpw',
      };

      repo.save.mockResolvedValue({ id: 1, ...dto } as User);

      const result = await service.create(dto);
      expect(repo.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });
});
