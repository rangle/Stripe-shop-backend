import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';

import { dynamoDb } from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const getProducts: Handler = (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const limit: number = 10;

    const params = {
        TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
        Select: 'ALL_ATTRIBUTES',
    };

    console.log('inside getProducts', params);

    dynamoDb.scan(params, (error, result) => {
        if (error) {
            return errorHandler(callBack, 'ERROR: Couldn\'t fetch the products.', error );
        }
        return successHandler(callBack, result);
    });
}
