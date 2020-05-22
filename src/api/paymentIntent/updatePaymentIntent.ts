import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe } from 'stripe';
import {errorHandler, successHandler} from "../../utils/apiResponse";

/**
 * Utility that should never be used in a Production environment.
 * Use startPayment to create or update the payment intent based on the Customer's Cart.
 */
export const updatePaymentIntent: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    // @ts-ignore
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: process.env.STRIPE_API_VERSION,
        typescript: true,
    });
    const requestData: any = JSON.parse((event as APIGatewayEvent).body);

    // @todo validation on inputs
    const {
        amount,
        currency,
        payment_method_types,
    } = requestData;

    const valid_payment_method_types = (payment_method_types) ? payment_method_types : ['card'];
    try {
        const paymentIntent = await stripe.paymentIntents.update(requestData.Id,{
            amount,
            currency,
            payment_method_types: valid_payment_method_types,
        });
        return successHandler(callBack, {
                    message: 'Payment Intent Created!',
                    PaymentIntent: paymentIntent,
                });
    }
    catch(error) {
        errorHandler(callBack,'Error: createPaymentIntent failed with an exception!', error);
    }
}
