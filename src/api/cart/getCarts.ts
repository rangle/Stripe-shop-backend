import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const getCarts: Handler = (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data =  JSON.parse((event as APIGatewayEvent).body);

    const params = {
        TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
        Select: 'ALL_ATTRIBUTES',
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
