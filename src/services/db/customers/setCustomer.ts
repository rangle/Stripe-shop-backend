import { upsert } from '../../../utils/db';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { CustomerInput, DbError } from '../../../types';
import { validateCustomer } from '../../../utils/CustomerValidations';

export const setCustomer = async ({
  customerDetails,
}: {
  customerDetails: CustomerInput;
}) => {
  const customer = validateCustomer(customerDetails);

  if (! customer.isValid) {
    return customer;
  }

  const params: DocumentClient.PutItemInput = {
    TableName: process.env.DYNAMODB_TABLE_SHOPPING,
    Item: customer.params,
  };

  return await upsert(params);
};
