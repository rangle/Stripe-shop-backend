import { upsert } from 'src/utils/db';
import { Item, UpsertItem } from 'src/types';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { columns, ITEM_PREFIX } from 'src/utils/constants/db_entity_constants';

const uuid = require('uuid');

export const addCustomerItem = async ({customerId, item}: {customerId: string, item: Item}) => {
  const timestamp = new Date().getTime();
  // @ts-ignore
  const newItem: UpsertItem = {
    ...item,
    [columns.customerId]: customerId,
    [columns.itemId]: `${ITEM_PREFIX}_${uuid.v1()}`,
    createdAt: timestamp,
    updatedAt: timestamp,
    [columns.itemType]: ((item.product.itemType) ?? columns.itemTypes.product) + '_' + uuid.v1(),
    [columns.orderStatus]: columns.orderStatuses.inCart,
  };

  const params: DocumentClient.PutItemInput = {
    TableName: process.env.DYNAMODB_TABLE_SHOPPING,
    Item: newItem,
  };

  return await upsert(params);
};
