import uuid = require('uuid');
import { itemsByCustomerIDStatus } from './customerCarts/getItemsForCustomer';
import { OrderFulfillmentStatuses } from '../../utils/constants/shopping_entity_constants';
import { Address, OrderFulfillmentStatusTypes } from '../../types';
import { updateCustomerOrderStatus } from './customerCarts/setItemForCustomer';
import { query } from '../../utils/db';

const timestamp = new Date().getTime();

export const getCustomerOrdersInCart = async (customerId: string) => {
  const params = itemsByCustomerIDStatus({ customerId, status: OrderFulfillmentStatuses.inCart });
  return await query(params);
};

export const getCustomerOrdersOrdered = async (customerId: string) => {
  const params = itemsByCustomerIDStatus({ customerId, status: OrderFulfillmentStatuses.ordered });
  return await query(params);
};

export const getCustomerOrdersPaid = async (customerId: string) => {
  const params = itemsByCustomerIDStatus({ customerId, status: OrderFulfillmentStatuses.paid });
  return await query(params);
};

export const getCustomerOrdersAllocated = async (customerId: string) => {
  const params = itemsByCustomerIDStatus({ customerId, status: OrderFulfillmentStatuses.allocated });
  return await query(params);
};

export const getCustomerOrdersShipped = async (customerId: string) => {
  const params = itemsByCustomerIDStatus({ customerId, status: OrderFulfillmentStatuses.shipped });
  return await query(params);
};

export const getCustomerOrdersDelivered = async (customerId: string) => {
  const params = itemsByCustomerIDStatus({ customerId, status: OrderFulfillmentStatuses.delivered });
  return await query(params);
};

export const updateCustomerOrderToOrdered = ({
  customerId,
  itemId,
}: {
  customerId: string;
  itemId: string;
}) => {
  const params = {
    customerId,
    itemId,
    status: OrderFulfillmentStatuses.ordered,
    };
  updateCustomerOrderStatus(params);
};

export const updateCustomerOrderAddPayment = ({
  customerId,
  itemId,
  payment,
}: {
  customerId: string;
  itemId: string;
  payment: any;
}) => {
  const params = {
    customerId,
    itemId,
    status: OrderFulfillmentStatuses.ordered,
    payment,
  };
  updateCustomerOrderStatus(params);
};

export const updateCustomerOrderToAllocated = ({
  customerId,
  itemId,
}: {
  customerId: string;
  itemId: string;
}) => {
  const params = {
      customerId,
    itemId,
    status: OrderFulfillmentStatuses.allocated,
};
  updateCustomerOrderStatus(params);
};

export const updateCustomerOrderToShipped = ({
  customerId,
  itemId,
}: {
  customerId: string;
  itemId: string;
  address?: Address;
}) => {
  const params = {
    customerId,
    itemId,
    status: OrderFulfillmentStatuses.shipped,
  };

  updateCustomerOrderStatus(params);
};

export const updateCustomerOrderToDelivered = async ({
  customerId,
  itemId,
}: {
  customerId: string;
  itemId: string;
}) => {
  const params = {
    customerId,
    itemId,
    status: OrderFulfillmentStatuses.delivered,
  };

  return await updateCustomerOrderStatus(params);
};
