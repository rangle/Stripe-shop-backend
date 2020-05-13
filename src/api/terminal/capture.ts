import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe } from 'stripe';
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const capturePaymentIntent: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    const config: Stripe.StripeConfig = {
        apiVersion: process.env.STRIPE_API_VERSION,
        typescript: true,
    };
    const stripe = new Stripe(process.env.STRIPE_API_KEY, config);
    console.log('config', config);

    const data =  JSON.parse((event as APIGatewayEvent).body);

    try {
        const paymentIntent = await stripe.paymentIntents.capture(data.pi_id);
        console.log('paymentIntent capture', paymentIntent);
        return successHandler(callBack,{
            success: true,
            message: 'SUCCESS payment intent captured!',
            paymentIntent: paymentIntent,
        });
    } catch (err) {
        return errorHandler(callBack, 'FAILURE payment intent not captured!', err);
    }
}

