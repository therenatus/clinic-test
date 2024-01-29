import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserQuery } from './query/user.query';

@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly query: UserQuery,
  ) {}

  @Get()
  async getAll(@Query() query: any) {
    return this.query.getAllUser(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }
}
