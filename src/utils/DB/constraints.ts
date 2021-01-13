/**
 * DynamoDB has less than, greater than, between and begins_with constraints on the Sort Key (SK)
 *
 */
import { ConstraintTypes, DBConstraintType, OrderFulfillmentStatusTypes } from 'src/types';
import {
  columnMapShopping,
  OrderFulfillmentStatuses,
} from '../constants/shopping_entity_constants';

const before_constraint = (status: OrderFulfillmentStatusTypes, sortable: string) => {
  const kce = ` AND ${columnMapShopping.orderFulfillmentStatus} <= :sc1`;
  const eav = { ':sc1': OrderFulfillmentStatuses[status] + '_' + sortable };
  return { kce, eav };
};

const after_constraint = (status: OrderFulfillmentStatusTypes, sortable: string) => {
  const kce = ` AND ${columnMapShopping.orderFulfillmentStatus} >= :sc1`;
  const eav = { ':sc1': OrderFulfillmentStatuses[status] + '_' + sortable };
  return { kce, eav };
};

const between_constraint = (
  status: OrderFulfillmentStatusTypes,
  sortable1: string,
  sortable2: string
) => {
  const kce = ` AND ${columnMapShopping.orderFulfillmentStatus} BETWEEN :sc1 AND :sc2`;
  const eav = {
    ':sc1': OrderFulfillmentStatuses[status] + '_' + sortable1,
    ':sc2': OrderFulfillmentStatuses[status] + '_' + sortable2,
  };
  return { kce, eav };
};

const no_constraint = (status: OrderFulfillmentStatusTypes) => {
  const kce = ` AND begins_with(${columnMapShopping.orderFulfillmentStatus} , :sc1)`;
  const eav = { ':sc1': OrderFulfillmentStatuses[status] + '_' };
  return { kce, eav };
};

export const resolveConstraints = (
  status: OrderFulfillmentStatusTypes,
  constraint: ConstraintTypes,
  smallerThan: string,
  largerThan: string
): DBConstraintType => {
  switch (constraint) {
    case 'before':
      return before_constraint(status, smallerThan);
    case 'after':
      return after_constraint(status, largerThan);
    case 'between':
      return between_constraint(status, largerThan, smallerThan);
    default:
      return no_constraint(status);
  }
};
