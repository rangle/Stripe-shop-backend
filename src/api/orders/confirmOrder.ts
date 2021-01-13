import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { updateCustomerOrderToDelivered } from '../../services/db/customerOrderUtils';

export const setOrderDelivered: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,

) => {
  try {
    const data = JSON.parse((event as APIGatewayEvent).body);
    await updateCustomerOrderToDelivered({ itemId: data.itemId, customerId: data.customerId });

    return successHandler({ success: 'orderConverted' });
  } catch (error) {
    return errorHandler('unable to confirm Customer Order', error);
  }
};
