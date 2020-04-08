import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from "../../utils/db";
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

export const importProducts: Handler = (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data: ImportProduct =  JSON.parse((event as APIGatewayEvent).body);

    const params: ProductTable = {
        TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
    };

    const errors: string[] = [];
    const results: string[] = [];

    for(let i = 0; i< data.Count; i++) {

        params.Item = data.Items[i];


        dynamoDb.put(params, (error, result) => {
            if (error) {
                errors.push(params.Item.name);
            }
            else {
                results.push(params.Item.name);
            }
        });
    }

    return successHandler(callBack, { errors, results });
}
