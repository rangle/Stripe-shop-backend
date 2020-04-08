import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const getOrder: Handler = (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data =  JSON.parse((event as APIGatewayEvent).body);
    const params = {
        TableName: process.env.DYNAMODB_TABLE_ORDERS,
        Key: {
            orderId: data.orderId,
        },
    };

    dynamoDb.get(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            return errorHandler(callBack, 'ERROR: Couldn\'t fetch the order', error );
        }
        // create a response
        return successHandler(callBack, result);

    });
}
