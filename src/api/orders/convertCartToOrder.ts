import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { updateCustomerOrderToOrdered } from '../../services/db/customerOrderUtils';

export const convertCartToOrder: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,
) => {
  const data = JSON.parse((event as APIGatewayEvent).body);

  const params = {
    customerId: data.customerId,
    itemId: data.itemId,
  };

  try {
    const order = updateCustomerOrderToOrdered(params);
    return successHandler(order);
  } catch (error) {
    return errorHandler("ERROR: Couldn't create an order", error);
  }
};
