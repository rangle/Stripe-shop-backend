import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import {errorHandler, successHandler} from "../../utils/apiResponse";
import getCustomersUtil from 'src/services/CustomerUtils/getAllCustomers';

export const getCustomers: Handler = async(event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    // const data =  JSON.parse((event as APIGatewayEvent).body);

    const limit: number = 10;
    const search: string = '';

    try {
        const customers = await getCustomersUtil({ search, limit });
        return successHandler(callBack, customers);
    } catch (error) {
        return errorHandler(callBack, "ERROR: Couldn't fetch the products.", error);
    }
}
