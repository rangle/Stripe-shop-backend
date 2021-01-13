import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { getCustomerOrdersInCart } from '../../services/db/customerOrderUtils';
import { errorHandler, successHandler } from "../../utils/apiResponse";

export const getCustomerCart: Handler = async (event: APIGatewayEvent | ScheduledEvent) => {

    try {
        const data = JSON.parse((event as APIGatewayEvent).body);

        const items = await getCustomerOrdersInCart(data.customerId);

        return successHandler(
            items,
        );
    }catch(error) {
        return errorHandler(
            'Error: getCustomerCart failed with an exception',
            error
        );
    }
};
