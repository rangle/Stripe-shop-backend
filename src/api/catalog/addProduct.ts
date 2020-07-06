import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import {upsert} from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";
import {productCreate} from "../../services/stripe/productCreate";
import {validInterval} from "../../utils/ProductValidations";
import {priceCreate} from "../../services/stripe/priceCreate";

const uuid = require('uuid');

console.log('process.env.DYNAMODB_TABLE_PRODUCTS', process.env.DYNAMODB_TABLE_PRODUCTS);

export const addProduct: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    try {
        const data: Product =  JSON.parse((event as APIGatewayEvent).body);
        const timestamp = new Date().getTime();

        const currency = 'cad';
        const params: ProductTable = {
            TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
            Item: {
                productId: uuid.v1(),
                name: data.name,
                description: data.description,
                amount: data.amount,
                currency: currency,
                createdAt: timestamp,
                updatedAt: timestamp,
            },
        };

        if (data.hasSubscription) {
            const stripeProduct = await productCreate({
                name: data.name,
                description: data.description,
            });
            params.Item.stripeProductId = stripeProduct.id;

            const interval: Interval = (data.interval && validInterval(data.interval)) ? <Interval>data.interval : 'month';
            const stripePrice = await priceCreate({
                productId: stripeProduct.id,
                unit_amount: data.amount,
                currency: currency,
                interval: interval,
            });
            params.Item.stripePriceId = stripePrice.id;
            params.Item.interval = interval;
        }

        await upsert(params);
        return successHandler(callBack, { productId: params.Item.productId });
    } catch(error){
        return errorHandler(callBack, 'Error: addProduct failed with exception.', error );
    }
}
