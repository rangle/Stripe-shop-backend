import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";

const uuid = require('uuid');

console.log('process.env.DYNAMODB_TABLE_PRODUCTS', process.env.DYNAMODB_TABLE_PRODUCTS);

export const addProduct: Handler = (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data: Product =  JSON.parse((event as APIGatewayEvent).body);
    const timestamp = new Date().getTime();

    const params: ProductTable = {
        TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
        Item: {
            productId: uuid.v1(),
            name: data.name,
            description: data.description,
            amount: data.amount,
            currency: 'cad',
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    dynamoDb.put(params, (error, result) => {
        if (error) {
            return errorHandler(callBack, 'ERROR: Couldn\'t add the Product.', error );
        }
        return successHandler(callBack, { productId: params.Item.productId });
    });
}
