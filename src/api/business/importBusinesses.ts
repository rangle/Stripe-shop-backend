import {APIGatewayEvent, ScheduledEvent, Callback, Context, Handler} from 'aws-lambda';
import {dynamoDb, upsert} from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";
import {validateBusiness} from "../../utils/BusinessValidations";

type ImportBusinesses = {
    Items: BusinessInput[],
    Count: number,
    ScannedCount: number,
};

export const importBusinesses: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data: ImportBusinesses = JSON.parse((event as APIGatewayEvent).body);
    const errors: any[] = [];
    const results: any[] = [];

    data.Items.map(async (business) => {
        try {
            const validBusiness = validateBusiness(business);
            if (!validBusiness.isValid) {
                throw (validBusiness.errors);
            }

            const params: BusinessTable = {
                TableName: process.env.DYNAMODB_TABLE_BUSINESSES,
                Item: validBusiness.params,
            };
            const result = upsert(params);
            results.push(result);
        } catch (e) {
            errors.push({
                message: 'Failed to insert ' + business.businessName,
                error: e,
            });
        }
    });

    return successHandler(callBack, {errors, results});
}
