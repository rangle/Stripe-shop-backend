import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import {upsert} from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";
import {validateCustomer} from "../../utils/CustomerValidations";
import {createCustomer} from "../../services/stripe/createCustomer";
import {updateCustomer} from "../../services/stripe/updateCustomer";

type saveCustomer = {
    isSaveCustomer: boolean;
}

export const addCustomer: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {

    const data: CustomerInput & saveCustomer =  JSON.parse((event as APIGatewayEvent).body);
    const validCustomer: validCustomer = validateCustomer(data);

    if (! validCustomer.isValid) {
        return errorHandler(callBack, 'ERROR: Customer contains invalid data.', validCustomer.error );
    }


    try {

        const stripeCustomer = data.isSaveCustomer && await upsertToStripe(validCustomer);
        validCustomer.params.StripeCustomerId = (data.isSaveCustomer) ? stripeCustomer.id : '';

        const params: CustomerTable = {
            TableName: process.env.DYNAMODB_TABLE_CUSTOMERS,
            Item: validCustomer.params,
        };
        const savedData = await upsert(params);
        console.log('savedData', savedData);

        return successHandler(
            callBack,
            {
                message: 'Stripe Customer Created!',
                id: params.Item.customerId,
                stripeCustomer: stripeCustomer,
            });
    }
    catch(error) {
        return errorHandler(
            callBack,
            'ERROR Customer Creation FAILED!',
            error
        );
    }
};

async function upsertToStripe(validCustomer) {
        const stripeCustomer = (validCustomer.params.StripeCustomerId)
            ? await updateCustomer(validCustomer.params)
            : await createCustomer(validCustomer.params);

    return stripeCustomer;
}

