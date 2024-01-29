import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { AccountEntity } from './entities/account.entity';
import { ConfirmationEntity } from './entities/emai-confirmation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQuery } from './query/user.query';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AccountEntity, ConfirmationEntity]),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService, UserQuery],
})
export class UserModule {}
