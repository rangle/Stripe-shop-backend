import { search } from '../../utils/db';

export const getCustomerItems = async (customerId: string): Promise<CartItems> => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
    FilterExpression: 'customerId = :id',
    ExpressionAttributeValues: { ':id': customerId },
  };
  const customerItems = await search(params);
  return customerItems;
};

export const getCustomerCart = async (customerId: string): Promise<CartItems> => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
    FilterExpression: 'customerId = :id and attribute_not_exists(OrderPendingId)',
    ExpressionAttributeValues: { ':id': customerId },
  };
  const customerItems = await search(params);
  return customerItems;
};

export const getSubscriptionItems = async (items: CartItems): Promise<SubscriptionItems> => {
  const filterExpressionKeys = items.reduce(
    (filterExpression, item, index) => (filterExpression[':p' + index] = item.productId),
    {}
  );

  const params = {
    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    FilterExpression:
      'productId IN (' +
      Object.keys(filterExpressionKeys).join(',') +
      ') and attribute_exists(stripePriceId)',
    ExpressionAttributeValues: filterExpressionKeys,
  };
  console.log('getSubscriptionItems.params', params);
  const subscriptionItems: SubscriptionItems = await search(params);
  return subscriptionItems;
};

export const getItemProducts = async (items: CartItems): Promise<Product[]> => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    FilterExpression: undefined,
    ExpressionAttributeValues: undefined,
  };
  const filterExpressionKeys = items.reduce((filterExpression, item, index) => {
    filterExpression[':p' + index] = item.productId;
    return filterExpression;
  }, {});
  // console.log('filterExpressionKeys', filterExpressionKeys);
  params.FilterExpression =
    'productId IN (' +
    Object.keys(filterExpressionKeys).join(',') +
    ') and attribute_not_exists(stripePriceId)';
  params.ExpressionAttributeValues = filterExpressionKeys;
  // console.log('getItemProducts.paras', params);
  const products: Product[] = await search(params);
  return products;
};
