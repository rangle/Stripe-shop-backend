import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";

const uuid = require('uuid');

type Products = {
    productId: string,
    quantity: string,
    amount: number,
}

type Order = {
    orderId: string,
    customerId: string,
    products: Products[],
    createdAt: number,
    updatedAt: number,
    currency?: 'cad' | 'usd',
    status: 'ordered' | 'shipped' | 'delivered';
};

type OrdersTable = {
    TableName: string,
    Item: Order,
}

export const addOrder: Handler = (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    const data: Order =  JSON.parse((event as APIGatewayEvent).body);
    const timestamp = new Date().getTime();

    const params: OrdersTable = {
        TableName: process.env.DYNAMODB_TABLE_ORDERS,
        Item: {
            orderId: uuid.v1(),
            customerId: data.customerId,
            products: data.products,
            createdAt: timestamp,
            updatedAt: timestamp,
            status: "ordered",
        },
    };

    dynamoDb.put(params, (error, result) => {
        // handle potential errors
        if (error) {
            return errorHandler(callBack, 'ERROR: Couldn\'t create an order', error );
        }
        return successHandler(callBack, result);
    });
}
