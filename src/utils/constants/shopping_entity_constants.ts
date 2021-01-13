// Primary Key (PK) prefixes
import { ItemTypes, OrderFulfillmentStatusTypes, SubscriptionTypes } from 'src/types';

export const CUSTOMER_PREFIX = 'CUST_';
export const ITEM_PREFIX = 'ITEM_';
export const PHONE_PREFIX = 'PHONE_';
export const EMAIL_PREFIX = 'EMAIL_';
export const CART_PREFIX = 'CART_';
export const QUANTITY_PREFIX = 'QTY_';
export const CUSTOMER = 'CUSTOMER';

// Column names
/**
 * See EntityAccessPatterns.md under /resources
 *
 */
export const columnMapShopping = {
  customerRecord: 'PK',
  reviewRecord: 'PK',
  itemRecord: 'PK',
  customerId: 'SK',
  customerRegion: 'GSA1',
  customerEmail: 'GSA2',
  customerPhone: 'GSA3',
  customerIdCart: 'PK',
  itemId: 'SK',
  orderFulfillmentStatus: 'GSA1',
  itemType: "GSA4",
  product: "product",
  payments: "payments",
  shipping: "shipping",
  quantity: "quantity",
  terms: "terms",
};

export const indexMapShopping = {
  status: 'GSI1',
  paymentIntent: 'GSI2',
  byRegion: 'GSI1',
  byEmail: 'GSI2',
  byPhone: 'GSI3',
  byType: 'GSI4',
}

export const OrderFulfillmentStatuses: {[key:string]: OrderFulfillmentStatusTypes} = {
  inCart: 'inCart',
  ordered: 'ordered',
  paid: 'paid',
  allocated: 'allocated',
  shipped: 'shipped',
  delivered: 'delivered',
  activated: 'activated',
  cancelled: 'cancelled',
};

export const itemTypes: {[key:string]: ItemTypes} = {
  product: 'product',
  licence: 'licence',
  service: 'service',
  rental: 'rental',
  lease: 'lease',
};

export const subscriptionPrefix = 'subscription_';

export const subscriptionTypes: {[key:string]: SubscriptionTypes} = {
  subscription_product: 'subscription_product',
  subscription_licence: 'subscription_licence',
  subscription_service: 'subscription_service',
};
