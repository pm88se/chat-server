import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/core/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validate(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return !user;
  }

  defaultMessage() {
    return 'Email already exists';
  }
}
