import {APIGatewayEvent, ScheduledEvent, Callback, Context, Handler} from 'aws-lambda';
import {Stripe} from 'stripe';
import {upsert} from "../../utils/db";
import {errorHandler, successHandler} from "../../utils/apiResponse";
import {validateBusiness} from "../../utils/BusinessValidations";
// import {createBusiness} from "../../services/stripe/createBusiness";

export const addBusiness: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: process.env.STRIPE_API_VERSION,
        typescript: true,
    });

    const data: BusinessInput = JSON.parse((event as APIGatewayEvent).body);
    const validBusiness: validBusiness = validateBusiness(data);

    if (!validBusiness.isValid) {
        return errorHandler(callBack, 'ERROR: Business contains invalid data.', validBusiness.errors);
    }

    try {
        // const stripeBusiness: Stripe.Business = await createBusiness(stripe, validBusiness.params);
        // validBusiness.params.StripeBusinessId = stripeBusiness.id;

        const params: BusinessTable = {
            TableName: process.env.DYNAMODB_TABLE_BUSINESSES,
            Item: validBusiness.params,
        };
        const savedData = await upsert(params);
        console.log('savedData', savedData);

        return successHandler(
            callBack,
            {
                message: 'Stripe Business Created!',
                business: params.Item,
            });
    } catch (error) {
        return errorHandler(
            callBack,
            'ERROR Business Creation FAILED!',
            error
        );
    }
};
