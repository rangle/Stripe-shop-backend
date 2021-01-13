import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { Stripe_API_Version } from '../../config';
import { Stripe } from 'stripe';
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const getPaymentIntents: Handler = async (event: APIGatewayEvent | ScheduledEvent) => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: Stripe_API_Version,

        typescript: true,
    });

    const limit = 10;
    try {
        const paymentIntents = await stripe.paymentIntents.list(
            {
                limit,
            }
        );
        return successHandler({
            message: 'List first ' + limit + ' Payment Intents!',
            PaymentIntent: paymentIntents,
        });
    }catch(error){
        return errorHandler('Error: getPaymentIntents failed with an exception', error);
    }
}
