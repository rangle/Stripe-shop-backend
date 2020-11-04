import { batchGet, query } from '../../utils/db';
import { CartItems, OrderStatuses, Product, SubscriptionItems } from 'src/types';



export const getCustomerItems = async ({ customerId, orderStatus }: { customerId: string, orderStatus: OrderStatuses }): Promise<CartItems> => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_SHOPPING,
    IndexName: 'customerId',
    KeyConditionExpression: 'customerId = :id',
    ExpressionAttributeValues: { ':id': customerId },
  };
  const customerItems = await query(params);
  return customerItems;
};

export const getCustomerCart = async (customerId: string): Promise<CartItems> => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
    IndexName: 'customerId',
    KeyConditionExpression: 'customerId = :id',
    ExpressionAttributeValues: { ':id': customerId },
    FilterExpression: 'attribute_not_exists(OrderPendingId)',
  };
  const customerItems = await query(params);
  return customerItems;
};

export const getSubscriptionItems = async (items: CartItems): Promise<Product[]> => {
  const products: Product[] = await getItems(items);
  const subscriptionProducts: Product[] = products.filter((product) => product.hasSubscription)
  return subscriptionProducts;
};

export const getProductItems = async (items: CartItems): Promise<Product[]> => {
  const products: Product[] = await getItems(items);
  const itemProducts: Product[] = products.filter((product) => !product.hasSubscription)
  return itemProducts;
};

export const getItems = async (items: CartItems): Promise<Product[]> => {
  const params = {
    RequestItems: {
      [process.env.DYNAMODB_TABLE_PRODUCTS]: {
        Keys: items.reduce((productIds, item, index) => {
            return [...productIds,
              { productId: item.productId },
            ];
          }, []),
      },
    },
  };
  const products: Product[] = await batchGet(params);
  return products;
};
