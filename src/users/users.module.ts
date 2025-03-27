import { Module } from '@nestjs/common';
import { User } from '../database/core/user.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsEmailUniqueConstraint } from './validators/is-email-unique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, IsEmailUniqueConstraint],
  exports: [TypeOrmModule, IsEmailUniqueConstraint],
})
export class UsersModule {}
