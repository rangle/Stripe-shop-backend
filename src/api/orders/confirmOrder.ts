import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from '../../utils/db';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { confirmCustomerOrder } from '../../services/db/customerOrderUtils';

export const confirmOrder: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,
  context: Context,
  callBack: Callback
) => {
  try {
    const data = JSON.parse((event as APIGatewayEvent).body);
    await confirmCustomerOrder(data.orderId, data.customerId);

    return successHandler(callBack, { success: 'orderConverted' });
  } catch (error) {
    return errorHandler(callBack, 'unable to confirm Customer Order', error);
  }
};
