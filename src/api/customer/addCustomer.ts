import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe } from 'stripe';
import {upsert} from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";
import {validateCustomer} from "../../utils/CustomerValidations";
import {createCustomer} from "../../services/stripe/createCustomer";

export const addCustomer: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: process.env.STRIPE_API_VERSION,
        typescript: true,
    });

    const data: CustomerInput =  JSON.parse((event as APIGatewayEvent).body);
    const validCustomer: validCustomer = validateCustomer(data);

    if (! validCustomer.isValid) {
        return errorHandler(callBack, 'ERROR: Customer contains invalid data.', validCustomer.error );
    }

    try {
        const stripeCustomer: Stripe.Customer = await createCustomer(stripe, validCustomer.params);
        validCustomer.params.StripeCustomerId = stripeCustomer.id;

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
