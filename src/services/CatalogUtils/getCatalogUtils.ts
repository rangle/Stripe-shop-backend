import { scan } from '../../utils/db';

const getCatalogUtil = async ({ search = '', limit = 10 }: { search: string; limit: number }) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    Select: 'ALL_ATTRIBUTES',
    Limit: limit ?? 100,
  };

  return await scan(params);
};

export default getCatalogUtil;
