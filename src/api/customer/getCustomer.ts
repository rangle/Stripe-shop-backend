import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { getCustomerById } from '../../services/db/customers/getCustomer';

export const getCustomer: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,
) => {
    try {
        const data =  JSON.parse((event as APIGatewayEvent).body);
    const customer = await getCustomerById(data.customerId);
    return successHandler(customer);
    } catch(error) {
        console.error(error);
    return errorHandler("ERROR: Couldn't fetch the customer", error);
    }
};
