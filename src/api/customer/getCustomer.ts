import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import {errorHandler, successHandler} from "../../utils/apiResponse";
import {customerRead} from "../../services/db/customerRead";

export const getCustomer: Handler = async(event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    try {
        const data =  JSON.parse((event as APIGatewayEvent).body);
        const customer = await customerRead(data.customerId);
        return successHandler(callBack, customer);
    } catch(error) {
        console.error(error);
        return errorHandler(callBack, 'ERROR: Couldn\'t fetch the customer', error );
    }
}
