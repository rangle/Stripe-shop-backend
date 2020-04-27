import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const getBusiness: Handler = (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data =  JSON.parse((event as APIGatewayEvent).body);
    const params = {
        TableName: process.env.DYNAMODB_TABLE_BUSINESSES,
        Key: {
            businessId: data.businessId,
        },
    };

    dynamoDb.get(params, (error, result) => {
        if (error) {
            console.error(error);
            return errorHandler(callBack, 'ERROR: Couldn\'t fetch the business', error );
        }
        return successHandler(callBack, result);
    });
}
