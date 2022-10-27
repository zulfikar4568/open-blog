import { ESortMode, IListRequestQuery } from '../types/query-cursor.type';

export const parseQueryCursor = <T>(
  query: T & IListRequestQuery,
): {
  limit: number;
  cursor: number | undefined;
  order: { [key: string]: ESortMode };
} => {
  const limit = query.filters.pagination?.limit || 25;
  const cursor = Number(query.filters.pagination?.cursor) || undefined;
  const order = {
    [query.filters.sort?.by || 'createdAt']:
      query.filters.sort?.mode || ESortMode.DESC,
  };

  return {
    limit: Number(limit),
    cursor,
    order,
  };
};

export const parseMetaCursor = <T>({
  result,
  total,
  limit,
  lastCursor,
}: {
  result: T[];
  total: number;
  limit: number;
  lastCursor: number;
}) => ({
  count: result.length,
  total,
  lastCursor,
  totalPage: Math.ceil(total / limit),
});
