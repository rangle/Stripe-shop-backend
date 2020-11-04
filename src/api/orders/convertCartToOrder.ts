import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from '../../utils/db';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { customerCartToOrder } from '../../services/db/customerOrderUtils';
import { OrderInput } from 'src/types';

export const convertCartToOrder: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,
  context: Context,
  callBack: Callback
) => {
  const data: OrderInput = JSON.parse((event as APIGatewayEvent).body);

  const props = {
    customerId: data.customerId,
    shippingAmount: <number>data.shippingAmount,
  };

  try {
    const order = await customerCartToOrder(props);
    console.log('order', order);
    return successHandler(callBack, order);
  } catch (error) {
    return errorHandler(callBack, "ERROR: Couldn't create an order", error);
  }
};
