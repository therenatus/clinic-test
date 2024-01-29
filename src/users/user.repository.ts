import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async getOne(id: string): Promise<UserEntity> {
    return this.repository.findOneBy({ id });
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    return this.repository.delete({ id });
  }

  async save(user: Repository<UserEntity>, data: UserEntity) {
    return user.save(data);
  }
}
