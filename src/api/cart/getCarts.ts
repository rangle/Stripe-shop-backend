import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from "../../utils/db";
import { errorHandler, successHandler } from "../../utils/apiResponse";
import {getCustomerItems} from "../../services/getCustomerCartItems";

export const getCarts: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data =  JSON.parse((event as APIGatewayEvent).body);

    const items = await getCustomerItems(data.customerId);

    return successHandler(
        callBack,
        items,
    );
};
