// Primary Key (PK) prefixes
import { ItemTypes } from 'src/types';

export const ITEM_PREFIX = 'ITEM_';
export const REVIEWER_PREFIX = 'CUST_';


const itemTypes: {[key:string]: ItemTypes} = {
  product: 'product',
  licence: 'licence',
  service: 'service',
  rental: 'rental',
  lease: 'lease',
  subscriptionProduct: 'subscription_product',
  subscriptionLicence: 'subscription_licence',
  subscriptionService: 'subscription_service',
};

export const indexMapProducts = {
  reviewsByType: 'GSI1',
  category: 'GSI2',
  productReviews: 'GSI3',
  productType: 'GSI4',
}

export const columnMapProducts = {
  productId: 'PK',
  versionCode_Date: 'SK',
  rating: 'GSA1',
  category: 'GSA2',
  itemType: "GSA4",
};
