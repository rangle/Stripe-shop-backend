import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { getCustomerByRegion } from '../../services/db/customers/getCustomer';
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const getCustomers: Handler = async(event: APIGatewayEvent | ScheduledEvent) => {

    // const data =  JSON.parse((event as APIGatewayEvent).body);

    const limit = 10;

    try {
        const customers = await getCustomerByRegion({region: 'Canada'});
        return successHandler(customers);
    } catch (error) {
        return errorHandler("ERROR: Couldn't fetch the products.", error);
    }
}
