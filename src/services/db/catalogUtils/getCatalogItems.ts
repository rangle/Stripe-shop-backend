import { CatalogTypes, ItemTypes, SubscriptionTypes } from '../../../types';
import {
  columnMapProducts,
  indexMapProducts,
} from '../../../utils/constants/products_entity_constants';
import { itemTypes, subscriptionTypes } from '../../../utils/constants/shopping_entity_constants';
import { query, scan } from '../../../utils/db';

export const getCatalogUtil = async ({
  search = '',
  limit = 10,
}: {
  search: string;
  limit: number;
}) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    Select: 'ALL_ATTRIBUTES',
    Limit: limit ?? 100,
  };

  return await scan(params);
};

const fromCatalog = ({ type }: { type: CatalogTypes }) => {
  return {
    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    IndexName: indexMapProducts.productType,
    KeyConditionExpression: `${columnMapProducts.itemType} = :type AND begins_with(${columnMapProducts.versionCode_Date}, :ver)`,
    ExpressionAttributeValues: {
      ':type': type,
      ':ver': 'v0_' + type.substr('subscription_'.length),
    },
  };
};

export const getSubscriptionFromCatalog = async (type: SubscriptionTypes) => {
  const params = fromCatalog({ type: subscriptionTypes[type] });
  return await query(params);
};

export const getItemsFromCatalog = async (type: ItemTypes) => {
  const params = fromCatalog({ type: type });
  return await query(params);
};
