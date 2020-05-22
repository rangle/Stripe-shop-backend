import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { upsert } from "../../utils/db";
import { errorHandler, successHandler } from "../../utils/apiResponse";

export const addCartItem: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const uuid = require('uuid');

    const data: PostCartItem =  JSON.parse((event as APIGatewayEvent).body);
    const timestamp = new Date().getTime();

    const params: CartTable = {
        TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
        Item: {
            cartItemId: uuid.v1(),
            customerId: (data.customer) ?? uuid.v1(),
            productId: data.item,
            quantity: 1,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    try {
        await upsert(params);
        return successHandler(callBack, {
            cartItemId: params.Item.cartItemId,
            customerId: params.Item.customerId,
        });
    }
    catch(error) {
        return errorHandler(callBack, 'ERROR: Couldn\'t add the Cart Item.', error );
    }
}
