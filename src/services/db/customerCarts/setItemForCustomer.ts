import uuid = require('uuid');
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';

import { updateItem, upsert } from '../../../utils/db';
import {
  columnMapShopping,
  CUSTOMER_PREFIX,
  ITEM_PREFIX,
  OrderFulfillmentStatuses,
} from '../../../utils/constants/shopping_entity_constants';
import { ItemTypes, OrderFulfillmentStatusTypes, Product } from '../../../types';

const validateItemDetail = (type: ItemTypes, itemString: string): boolean => {
  const parts = itemString.split('_', 1);
  return (type == parts[0])
}

const currentTime = () => new Date().getTime();

export const addItemToCustomerCart = async ({
  customerId,
  itemDetail,
  quantity = 1,
  itemType = 'product',
}: {
  customerId: string;
  itemDetail: Product;
  quantity: number ;
  itemType: ItemTypes;
}) => {
  const newItem: DocumentClient.PutItemInputAttributeMap = {
    [columnMapShopping.customerIdCart]: CUSTOMER_PREFIX + customerId,
    [columnMapShopping.itemId]: ITEM_PREFIX + itemDetail.productId,
    [columnMapShopping.orderFulfillmentStatus]: OrderFulfillmentStatuses.inCart + '_' + currentTime(),
    product: itemDetail,
    quantity: quantity,
    createdAt: currentTime(),
    updatedAt: currentTime(),
  };

  const params: DocumentClient.PutItemInput = {
    TableName: process.env.DYNAMODB_TABLE_SHOPPING,
    Item: newItem,
  };

  return await upsert(params);
};

export const modifyItemInCustomerCart = async ({
  customerId,
  itemDetail,
  quantity = 1,
  terms,
}: {
  customerId: string;
  itemDetail: Product;
  quantity: number;
  terms?: any;
}) => {
  const updateItemParams: DocumentClient.UpdateItemInput = {
    TableName: process.env.DYNAMODB_TABLE_SHOPPING,
    Key: {
      [columnMapShopping.customerId]: CUSTOMER_PREFIX + customerId,
      [columnMapShopping.itemId]: ITEM_PREFIX + itemDetail.productId,
    },
    UpdateExpression: 'set quantity = :qty, product = :item, updatedAt = :time',
    ExpressionAttributeValues: {
      ':qty': quantity,
      ':item': itemDetail,
      ':time': currentTime,
    }
  };
  if (terms) {
    updateItemParams.UpdateExpression += ' , terms = :terms';
    updateItemParams.ExpressionAttributeValues[':terms'] = terms;
  }

  return await updateItem(updateItemParams);
};


export const updateCustomerOrderStatus = async ({
  itemId,
  customerId,
  status,
  payment,
}: {
  itemId: string;
  customerId: string;
  status: OrderFulfillmentStatusTypes;
  payment?: any
}) => {
  const updateItemParams: DocumentClient.UpdateItemInput = {
    TableName: process.env.DYNAMODB_TABLE_SHOPPING,
    Key: {
      [columnMapShopping.customerId]: CUSTOMER_PREFIX + customerId,
      [columnMapShopping.itemId]: ITEM_PREFIX + itemId,
    },
    UpdateExpression: `set ${columnMapShopping.orderFulfillmentStatus} = :status , updatedAt = :time`,
    ExpressionAttributeValues: {
      ':status': OrderFulfillmentStatuses[status] + '_' + currentTime(),
      ':time': currentTime(),
    }
  }
  if (payment) {
    updateItemParams.UpdateExpression += ', payments = list_append(payments, :payment)';
    updateItemParams.ExpressionAttributeValues[":payment"] = [payment]
  }
  return await updateItem(updateItemParams);
};

export const updateCustomerOrderAddShipping = async ({
  itemId,
  customerId,
  shipping,
}: {
  itemId: string;
  customerId: string;
  shipping: any
}) => {
  const updateItemParams: DocumentClient.UpdateItemInput = {
    TableName: process.env.DYNAMODB_TABLE_SHOPPING,
    Key: {
      [columnMapShopping.customerId]: CUSTOMER_PREFIX + customerId,
      [columnMapShopping.itemId]: ITEM_PREFIX + itemId,
    },
    UpdateExpression: `set ${columnMapShopping.shipping} = :ship , updatedAt = :time`,
    ExpressionAttributeValues: {
      ':ship': shipping,
      ':time': currentTime(),
    }
  }
  return await updateItem(updateItemParams);
};
