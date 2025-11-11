export interface IOptions {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sort?: string;
}

export interface IResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sort: string;
}

function calculatePagination(options: IOptions): IResult {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sort = options.sort || "desc";
  return {
    skip,
    limit,
    page,
    sortBy,
    sort,
  };
}
export const paginationHelper = {
  calculatePagination,
};
