// Primary Key (PK) prefixes
import { ItemTypes, OrderStatuses } from 'src/types';

export const ITEM_PREFIX = 'ITEM';
export const CUSTOMER_PREFIX = 'CUST_';

// Column names
/**
 * See EntityAccessPaterns.md under /resources
 *
 */
const orderStatuses: {[key:string]: OrderStatuses} = {
  inCart: 'inCart',
  ordered: 'ordered',
  paid: 'paid',
  shipped: 'shipped',
  delivered: 'delivered',
};

const itemTypes: {[key:string]: ItemTypes} = {
  product: 'product',
  licence: 'licence',
  service: 'service',
  subscription_product: 'subscription_product',
  subscription_licence: 'subscription_licence',
  subscription_service: 'subscription_service',
};

export const columns = {
  customerId: 'PK',
  customerEmail: 'GSA1',
  itemId: 'SK',
  orderStatus: 'GSA1',
  orderStatuses,
  itemType: 'LSA1',
  itemTypes,
  stripeID: 'GSA2',
};
