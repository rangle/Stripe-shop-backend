import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ConstraintTypes, ItemTypes, OrderFulfillmentStatusTypes } from '../../../types';
import {
  columnMapShopping,
  CUSTOMER_PREFIX,
  indexMapShopping,
  ITEM_PREFIX,
} from '../../../utils/constants/shopping_entity_constants';
import { query } from '../../../utils/db';
import { resolveConstraints } from '../../../utils/DB/constraints';

const customerById = ({customerId}: {customerId: string}) => {
  const params: DocumentClient.QueryInput = {
    TableName: process.env.DYNAMODB_TABLE_SHOPPING,
    KeyConditionExpression: `${columnMapShopping.itemRecord} = :cKey`,
    ExpressionAttributeValues: {
        ":cKey": CUSTOMER_PREFIX + customerId,
    },
  }
  return params;
}

const itemsByCustomerId = ({ customerId, type = null }: { customerId: string, type?: ItemTypes }) => {
  const params = customerById({ customerId });
  if (type === null) {
    return params;
  }
  return {
    ...params,
    IndexName: indexMapShopping.byType,
    KeyConditionExpression: params.KeyConditionExpression + ` AND begins_with(${columnMapShopping.itemType}, :type)`,
    ExpressionAttributeValues: {
      ...params.ExpressionAttributeValues,
      ':type': type,
    }
  }
}

/**
 * returns all items for a specific customer - no sort, no pagination, no groupings.
 * @param customerId uuid for a specific customer
 */
export const getItemsByCustomerId = async ({ customerId }: { customerId: string }) => {
  const params = itemsByCustomerId({ customerId });
  return await query(params);
};

/**
 * Returns a specific item for a specific customer
 * @param customerId uuid for a customer
 * @param itemId uuidd for an item
 */
export const getItemByCustomerAndItemId = async ({
  customerId,
  itemId,
}: {
  customerId: string;
  itemId: string;
}) => {
  const params = customerById({ customerId });
  params.KeyConditionExpression += ` AND ${columnMapShopping.itemId} = :iId`,
  params.ExpressionAttributeValues[':iId'] = ITEM_PREFIX + '_' + itemId;
  return await query(params);
};

export const itemsByCustomerIDStatus = ({
  customerId,
  status,
  constraint = null,
  startDate = null,
  endDate = null,
}: {
  customerId: string;
  status: OrderFulfillmentStatusTypes;
  constraint?: ConstraintTypes;
  startDate?: string;
  endDate?: string;
}) => {
  const params = customerById({ customerId });
  const { kce, eav } = resolveConstraints(status, constraint, startDate, endDate);
  return {
    ...params,
    KeyConditionExpression: params.KeyConditionExpression + kce,
    ExpressionAttributeValues: {
      ...params.ExpressionAttributeValues,
      ...eav,
    },
  };
};
