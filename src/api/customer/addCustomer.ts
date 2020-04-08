import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { dynamoDb } from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";
import {validateCustomer} from "../../utils/CustomerValidations";

export const addCustomer: Handler = (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data: CustomerInput =  JSON.parse((event as APIGatewayEvent).body);

    const validCustomer: validCustomer = validateCustomer(data);

    if (! validCustomer.isValid) {
        return errorHandler(callBack, 'ERROR: Customer contains invalid data.', validCustomer.error );
    }

    const params: CustomerTable = {
        TableName: process.env.DYNAMODB_TABLE_CUSTOMERS,
        Item: validCustomer.params,
    };
    console.log('params', params);
    dynamoDb.put(params, (error, result) => {
        if (error) {
            return errorHandler(callBack, 'ERROR: Couldn\'t add a Customer.', error );
        }
        return successHandler(callBack, {customerId: validCustomer.params.customerId});
    });
}
