import { UserRole } from '../../users/types/user-roles.enum';

export type QueryType = {
  type: UserRole.USER | UserRole.ADMIN;
  page?: number;
  offset?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  name?: string;
};
