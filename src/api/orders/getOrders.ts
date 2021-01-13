import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { dynamoDb } from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const getOrders: Handler = (event: APIGatewayEvent | ScheduledEvent) => {

    const data =  JSON.parse((event as APIGatewayEvent).body);
    const params = {
        TableName: process.env.DYNAMODB_TABLE_ORDERS,
        Select: 'ALL_ATTRIBUTES',
    };

    dynamoDb.scan(params, (error, result) => {
        if (error) {
            console.error(error);
            return errorHandler('ERROR: Couldn\'t fetch the customer', error );
        }
        return successHandler(result);
    });
}
