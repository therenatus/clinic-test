import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { QueryBuilder } from '../../helpers/query-builder';

@Injectable()
export class UserQuery {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async getAllUser(query: any) {
    const queryParam = QueryBuilder(query);
    const queryBuilder = this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.accountData', 'account')
      .leftJoinAndSelect('users.emailConfirmation', 'confirmation');

    if (queryParam.searchNameTerm) {
      queryBuilder.andWhere('account.name LIKE :fullName', {
        fullName: queryParam.searchNameTerm,
      });
    }
    if (queryParam.pageSize) {
      queryBuilder.limit(queryParam.pageSize);
    }

    if (queryParam.pageNumber) {
      queryBuilder.offset(queryParam.pageNumber);
    }

    return queryBuilder.getMany();
  }
}
