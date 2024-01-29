import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getOne(id: string): Promise<UserEntity> {
    const user = await this.repository.getOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
