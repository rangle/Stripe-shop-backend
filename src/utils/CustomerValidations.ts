import uuid = require('uuid');
import { Customer, CustomerInput, DbError } from 'src/types';
import { CUSTOMER_PREFIX } from '../utils/constants/db_entity_constants';

export const validateCustomer = (dataIn: CustomerInput) => {
  const errors: DbError[] = [];
  const timestamp = new Date().getTime();

  const params: Customer = {
    createdAt: timestamp,
    ...dataIn,
    customerId: dataIn.customerId ? dataIn.customerId : CUSTOMER_PREFIX + uuid.v1(),
    updatedAt: timestamp,
  };

  console.log('validated customer', { dataIn, params });
  return errors.length === 0 ? { isValid: true, params } : { isValid: false, errors };
};
