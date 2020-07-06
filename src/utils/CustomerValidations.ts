import uuid = require('uuid');

export const validateCustomer = (dataIn: CustomerInput) => {
  const errors: DbError = {};
  const timestamp = new Date().getTime();

  const params: Customer = {
    customerId: uuid.v1(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  if (dataIn.customerId) params.customerId = dataIn.customerId;
  if (dataIn.name) params.name = dataIn.name;
  if (dataIn.phone) params.phone = dataIn.phone;
  if (dataIn.email) params.email = dataIn.email;
  if (dataIn.address) params.address = dataIn.address;
  if (dataIn.StripeCustomerId) params.StripeCustomerId = dataIn.StripeCustomerId;

  return Object.keys(errors).length === 0 ? { isValid: true, params } : { isValid: false, errors };
};
