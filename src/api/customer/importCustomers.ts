import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from "../../utils/db";
import { Customer, CustomerTable } from "../../../types";
import { successHandler} from "../../utils/apiResponse";

type ImportCustomers = {
    Items: Customer[],
    Count: number,
    ScannedCount: number,
};

export const importCustomers: Handler = (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data: ImportCustomers =  JSON.parse((event as APIGatewayEvent).body);

    const params: CustomerTable = {
        TableName: process.env.DYNAMODB_TABLE_CUSTOMERS,
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
