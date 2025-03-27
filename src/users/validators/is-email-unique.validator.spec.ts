import { IsEmailUniqueConstraint } from './is-email-unique.validator';
import { User } from 'src/database/core/user.entity';
import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('IsEmailUniqueConstraint', () => {
  let validator: IsEmailUniqueConstraint;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        IsEmailUniqueConstraint,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    validator = moduleRef.get(IsEmailUniqueConstraint);
    userRepository = moduleRef.get(getRepositoryToken(User));
  });

  it('should return true if email is unique (not found)', async () => {
    userRepository.findOneBy.mockResolvedValue(null);

    const result = await validator.validate('test@example.com');

    expect(result).toBe(true);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
  });

  it('should return false if email already exists', async () => {
    userRepository.findOneBy.mockResolvedValue({ id: 1 } as User);

    const result = await validator.validate('duplicate@example.com');

    expect(result).toBe(false);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({
      email: 'duplicate@example.com',
    });
  });

  it('should return default error message', () => {
    const message = validator.defaultMessage();
    expect(message).toBe('Email already exists');
  });
});
