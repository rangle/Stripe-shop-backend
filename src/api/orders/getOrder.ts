import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { getCustomerOrdersInCart } from '../../services/db/customerOrderUtils';

export const getOrder: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,

) => {
  try {
  const data = JSON.parse((event as APIGatewayEvent).body);
    const items = await getCustomerOrdersInCart(data.customerId);

    return successHandler({ success: true, items });
  } catch (error) {
    return errorHandler('unable to confirm Customer Order', error);
    }
};
