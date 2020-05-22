import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe } from 'stripe';
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const getPaymentIntents: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: process.env.STRIPE_API_VERSION,
        typescript: true,
    });

    const limit: number = 10;
    try {
        const paymentIntents = await stripe.paymentIntents.list(
            {
                limit,
            }
        );
        return successHandler(callBack, {
            message: 'List first ' + limit + ' Payment Intents!',
            PaymentIntent: paymentIntents,
        });
    }catch(error){
        return errorHandler(callBack, 'Error: getPaymentIntents failed with an exception', error);
    }
}
