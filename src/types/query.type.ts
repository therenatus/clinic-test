export type QueryType = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: directionEnum;
  pageNumber: number;
  pageSize: number;
};

enum directionEnum {
  ASC = 'asc',
  DESC = 'desc',
}
