import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as crypto from 'crypto';

export const UserAgent = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    let agent = request.headers['user-agent'];
    if (!agent) {
      agent = crypto.randomUUID();
    }
    return agent;
  },
);
