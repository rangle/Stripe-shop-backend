import {
  batchDelete,
  deleteItem,
  dynamoDb,
  search,
  update,
  updateBatchData,
  updateItem,
  upsert,
} from '../../utils/db';
import { getCustomerCart, getCustomerItems, getItemProducts } from './getCustomerCartUtils';
import { log } from 'util';

const uuid = require('uuid');
const timestamp = new Date().getTime();

export const getCustomerOrders = async (customerId: string): Promise<CartItems> => {
  console.log('customerId', customerId);

  const params = {
    TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
    FilterExpression: 'customerId = :id',
    ExpressionAttributeValues: { ':id': customerId },
  };
  const customerItems = await search(params);
  console.log('customerItems', customerItems);

  return customerItems;
};

export const saveCustomerOrder = async (
  customerId: string,
  orderItems: OrderItems,
  orderTotal: number,
  shippingAmount: number
): Promise<Order> => {
  try {
    const orderId = uuid.v1();
    const params: OrdersTable = {
      TableName: process.env.DYNAMODB_TABLE_ORDERS,
      Item: {
        orderId: orderId,
        customerId: customerId,
        products: orderItems,
        orderTotal,
        shippingAmount,
        createdAt: timestamp,
        updatedAt: timestamp,
        orderStatus: 'pending',
      },
    };
    console.log('saveCustomerOrder', params);
    await upsert(params);
    return params.Item;
  } catch (error) {
    console.log('unable to save order', error);
  }
};

const updateCartAsOrdered = async (orderItems: OrderItems, OrderId: String): Promise<any[]> => {
  console.log('updateCartAsOrdered.OrderId', OrderId);
  const params = {
    TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
    Key: { cartItemId: undefined },
    UpdateExpression: 'set OrderPendingId = :OrderId',
    ExpressionAttributeValues: {
      ':OrderId': OrderId,
    },
  };
  return await updateBatchData(orderItems, params, 'cartItemId');
};

export const customerCartToOrder = async ({
  customerId,
  shippingAmount,
}: {
  customerId: string;
  shippingAmount: number;
}): Promise<Order> => {
  try {
    const cartItems = await getCustomerCart(customerId);
    if (cartItems.length === 0) {
      console.log('cart empty');
      throw new Error('The cart contains no items');
    }
    const products: Product[] = await getItemProducts(cartItems);
    const orderTotal: number = products.reduce((acc, prod) => (acc += prod.amount), 0);
    const orderItems: OrderItems = cartItems.reduce((orderItems: OrderItems, item): OrderItems => {
      const orderItem = {
        productId: item.productId,
        cartItemId: item.cartItemId,
        quantity: item.quantity,
        // subtotal: item.quantity * products
      };
      return [...orderItems, orderItem];
    }, []);

    const order: Order = await saveCustomerOrder(
      customerId,
      orderItems,
      orderTotal,
      shippingAmount
    );
    console.log('new Order: ', order);
    const result = await updateCartAsOrdered(orderItems, order.orderId);
    console.log('result', { result, order });
    return order;
  } catch (error) {
    console.log('unable to save order', error);
  }
};

export const confirmCustomerOrder = async (orderId: string, customerId: string) => {
  try {
    await updateOrderStatus(orderId, 'ordered');
    await deleteOrderedItemsFromCart(customerId, orderId);

    return true;
  } catch (error) {
    console.log('update Order Status failed: ', error);
    return false;
  }
};

const updateOrderStatus = async (orderId, status: OrderStatus) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_ORDERS,
    Key: { orderId: orderId },
    UpdateExpression: 'set orderStatus = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ReturnValues: 'UPDATED_NEW',
  };
  await updateItem(params);
};

const deleteOrderedItemsFromCart = async (customerId: string, orderId: string) => {
  const cartItems = await getCustomerItems(customerId);
  console.log('cartItems, orderId', { cartItems, orderId });
  const itemsToDelete: any[] = cartItems
    .filter((cartItem) => cartItem.OrderPendingId === orderId)
    .reduce((acc: string[], cartItem) => {
      return [...acc, cartItem.cartItemId];
    }, []);
  const params = {
    TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
    Key: { cartItemId: undefined },
  };
  console.log('itemsToDelete', itemsToDelete);
  await batchDelete(params, itemsToDelete, 'cartItemId');
};
