import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import {dynamoDb, upsert} from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";

const uuid = require('uuid');

console.log('process.env.DYNAMODB_TABLE_PRODUCTS', process.env.DYNAMODB_TABLE_PRODUCTS);

export const addProduct: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    try {
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

        await upsert(params);
        return successHandler(callBack, { productId: params.Item.productId });
    } catch(error){
        return errorHandler(callBack, 'Error: addProduct failed with exception.', error );
    }
}
