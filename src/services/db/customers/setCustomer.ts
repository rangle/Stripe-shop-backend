import { upsert } from '../../../utils/db';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import {
  columnMapShopping,
  CUSTOMER_PREFIX,
  EMAIL_PREFIX,
  PHONE_PREFIX,
} from '../../../utils/constants/shopping_entity_constants';
import { CustomerInput } from '../../../types';
import { validateCustomer } from '../../../utils/CustomerValidations';

export const setCustomer = async ({
  customerDetails,
}: {
  customerDetails: CustomerInput;
}) => {
  const timestamp = new Date().getTime();
  const customer = validateCustomer(customerDetails);
  
  if (!customer.isValid) {
    const msg = (customer.errors) 
    ? customer.errors.message
    : 'unknown error validating customer';
    throw Error(msg);
  }

  const params: DocumentClient.PutItemInput = {
    TableName: process.env.DYNAMODB_TABLE_SHOPPING,
    Item: customer.params,
  };

  return await upsert(params);
};
