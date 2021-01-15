import { ItemTypes } from 'src/types';
import {
  columnMapProducts,
  indexMapProducts,
} from '../../../utils/constants/products_entity_constants';
import { get, query, scan } from '../../../utils/db';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';

export const dumpFullCatalogUtil = async ({
  limit = 100,
}: {
  search: string;
  limit: number;
}) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    Select: 'ALL_ATTRIBUTES',
    Limit: limit,
  };

  return await scan(params);
};

const fromCatalog = ({ type }: { type: ItemTypes }) => {
  return {
    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    IndexName: indexMapProducts.productType,
    KeyConditionExpression: `${columnMapProducts.itemType} = :type AND begins_with(${columnMapProducts.versionCode_Date}, :ver)`,
    ExpressionAttributeValues: {
      ':type': type,
      ':ver': 'V0_',
    },
  };
};

const byPrimaryKey = ({ id, version }: { id: string, version: string }): DocumentClient.GetItemInput => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    Key: {},
    };

  params.Key[columnMapProducts.productId] =  {"S": id};
  params.Key[columnMapProducts.versionCode_Date] = {"S": version};
  return params;
};

export const getItemsFromCatalog = async (type: ItemTypes) => {
  const params = fromCatalog({ type: type });
  return await query(params);
};

export const getItemFromCatalog = async (id: string, version: string): Promise<DocumentClient.GetItemOutput> => {
  const params = byPrimaryKey({id, version});
  console.log('get params', params);
  return await get(params);
}
