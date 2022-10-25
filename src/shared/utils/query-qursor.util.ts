import { ESortMode, IListRequestQuery } from '../types/query-qursor.type';

export const parseQueryQursor = <T>(
  query: T & IListRequestQuery,
): {
  limit: number;
  qursor: number | undefined;
  order: { [key: string]: ESortMode };
} => {
  const limit = query.filters.pagination?.limit || 25;
  const qursor = query.filters.pagination?.qursor || undefined;
  const order = {
    [query.filters.sort?.by || 'createdAt']:
      query.filters.sort?.mode || ESortMode.DESC,
  };

  return {
    limit: Number(limit),
    qursor,
    order,
  };
};

export const parseMetaCursor = <T>({
  result,
  total,
  limit,
  lastQursor,
}: {
  result: T[];
  total: number;
  limit: number;
  lastQursor: number;
}) => ({
  count: result.length,
  total,
  lastQursor,
  totalPage: Math.ceil(total / limit),
});
