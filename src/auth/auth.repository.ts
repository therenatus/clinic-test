import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { RefreshTokenEntity } from './entities/token.entity';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly tokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async getOneByEmail(email: string): Promise<UserEntity> {
    return this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.accountData', 'account')
      .leftJoinAndSelect('users.emailConfirmation', 'confirmation')
      .addSelect('account.password')
      .where('account.email = :email', { email })
      .getOne();
  }

  async getUserById(userId: string): Promise<UserEntity> {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.accountData', 'account')
      .addSelect('account.password')
      .where({ id: userId })
      .getOne();
  }

  async addToken(refreshTokenEntity: RefreshTokenEntity) {
    return this.tokenRepository.save(refreshTokenEntity);
  }

  async getOneToken(token: string, device: string) {
    return this.tokenRepository.findOne({
      where: { token: token, device: device },
    });
  }

  async deleteToken(
    userId: string,
    token: string,
    device: string,
  ): Promise<boolean> {
    const { affected } = await this.tokenRepository.delete({
      userId,
      token,
      device,
    });
    return !!affected;
  }

  async getUserByCode(code: string): Promise<UserEntity> {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.accountData', 'account')
      .leftJoinAndSelect('user.emailConfirmation', 'confirmation')
      .addSelect('account.password')
      .where('confirmation.confirmationCode = :code', { code })
      .getOne();
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }
}
