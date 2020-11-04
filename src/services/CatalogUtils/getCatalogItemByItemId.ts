import { get } from '@/utils/db';

export const getCatalogItemByItemId = async (id) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    Key: {
      productId: id,
    },
  };
  try {
    const result = await get(params);
    if (result && result.Item) {
      return result.Item;
    }
    else {
      throw new Error('no items found');
    }
  }catch (e) {
    console.log('FAILURE - getCatalogItemByItemId', e);
    throw new Error('unable to get Catalog Item By Id ');
  }
}
