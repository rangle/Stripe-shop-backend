import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import {batchUpsert, dynamoDb, upsert} from "../../utils/db";
import { successHandler} from "../../utils/apiResponse";

type Product = {
    productId: string,
    name: string,
    description: string,
    amount: number,
    currency: 'cad' | 'usd',
    createdAt: number,
    updatedAt: number,
};

type ProductTable = {
    TableName: string,
    Item?: Product,
};

type ImportProduct = {
    Items: Product[],
    Count: number,
    ScannedCount: number,
};

console.log('process.env.DYNAMODB_TABLE_PRODUCTS', process.env.DYNAMODB_TABLE_PRODUCTS);

export const importProducts: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data: ImportProduct =  JSON.parse((event as APIGatewayEvent).body);

    const results = await batchUpsert(data.Items, process.env.DYNAMODB_TABLE_PRODUCTS);

    console.log('results', results);

    return successHandler(callBack, {results});
}
