import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { OrderStatuses } from 'src/types';
import { columns } from 'src/utils/constants/db_entity_constants';
import { query } from 'src/utils/db';
/**
  inCart: 'inCart',
  ordered: 'ordered',
  payed: 'paid',
  shipped: 'shipped',
  delivered: 'delivered',
 **/
export const getCustomerCartItems = async ({customerId}) => {
  const props: {customerId: string, itemType: OrderStatuses} = {
    customerId,
    itemType: columns.orderStatuses.inCart,
  }
  return getCustomersItems(props)
}

export const getCustomerCheckoutItems = async ({customerId}) => {
  const props: {customerId: string, itemType: OrderStatuses} = {
    customerId,
    itemType: columns.orderStatuses.ordered,
  }
  return getCustomersItems(props)
}

export const getCustomerOrderedItems = async ({customerId}) => {
  const props: {customerId: string, itemType: OrderStatuses} = {
    customerId,
    itemType: columns.orderStatuses.paid,
  }
  return getCustomersItems(props)
}

export const getCustomerShippedItems = async ({customerId}) => {
  const props: {customerId: string, itemType: OrderStatuses} = {
    customerId,
    itemType: columns.orderStatuses.shipped,
  }
  return getCustomersItems(props)
}

export const getCustomerDeliveredItems = async ({customerId}) => {
  const props: {customerId: string, itemType: OrderStatuses} = {
    customerId,
    itemType: columns.orderStatuses.delivered,
  }
  return getCustomersItems(props)
}

const getCustomersItems = async ({customerId, itemType}: {customerId: string, itemType: OrderStatuses}) => {
  const params: DocumentClient.QueryInput = {
    TableName: process.env.DYNAMODB_TABLE_SHOPPING,
    KeyConditionExpression: `${columns.customerId} = :cId and ${columns.itemId} begins_with(${columns[itemType]})`,
    ExpressionAttributeValues: {
      ":cId": customerId,
    },
  };
  return await query(params);
};
