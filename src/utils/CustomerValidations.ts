import uuid = require('uuid');
import { Customer, CustomerInput, DbError } from '../../types';

export const validateCustomer = (dataIn: CustomerInput) => {
  const errors: DbError = {};
  const timestamp = new Date().getTime();

  const params: Customer = {
    customerId: dataIn.customerId ? dataIn.customerId : uuid.v1(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  if (dataIn.name) params.name = dataIn.name;
  if (dataIn.phone) params.phone = dataIn.phone;
  if (dataIn.email) params.email = dataIn.email;
  if (dataIn.address) params.address = dataIn.address;
  if (dataIn.StripeCustomerId) params.StripeCustomerId = dataIn.StripeCustomerId;
  console.log('validated customer', { dataIn, params });
  return Object.keys(errors).length === 0 ? { isValid: true, params } : { isValid: false, errors };
};
