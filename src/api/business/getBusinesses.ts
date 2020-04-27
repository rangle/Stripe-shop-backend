import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const getBusinesses: Handler = (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data =  JSON.parse((event as APIGatewayEvent).body);
    const params = {
        TableName: process.env.DYNAMODB_TABLE_BUSINESSES,
        Select: 'ALL_ATTRIBUTES',
    };

    dynamoDb.scan(params, (error, result) => {
        if (error) {
            console.error(error);
            return errorHandler(callBack, 'ERROR: Couldn\'t fetch the business', error );
        }
        return successHandler(callBack, result);
    });
}
