import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Item } from '../../../types';
import { columnMapProducts, ITEM_PREFIX } from '../../../utils/constants/products_entity_constants';
import { query } from '../../../utils/db';

const mapItemResult = (item) => {
  return {
    productId: item[columnMapProducts.productId].replace(ITEM_PREFIX, ''),
    rating: item[columnMapProducts.rating],
    category: item[columnMapProducts.category],
    product: item.product,
    type: item[columnMapProducts.itemType]
  }
}

export const getCatalogItemByItemId = async (itemId: string): Promise<Item> => {
  const params: DocumentClient.QueryInput = {
    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    KeyConditionExpression: `${columnMapProducts.productId} = ${itemId} and begins_with(${columnMapProducts.versionCode_Date}, :ver)`,
    ExpressionAttributeValues: { ':ver': 'v0' },
  };
  try {
    const result = await query(params);
    if (result && result.Item) {
      return mapItemResult(result.Item);
    } else {
      throw new Error('no items found');
    }
  } catch (e) {
    console.log('FAILURE - getCatalogItemByItemId', e);
    throw new Error('unable to get Catalog Item By Id ');
  }
};
