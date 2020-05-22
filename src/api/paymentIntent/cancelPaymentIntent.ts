import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe} from 'stripe';
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const cancelPaymentIntent: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: process.env.STRIPE_API_VERSION,
        typescript: true,
    });

    const requestData: any = JSON.parse((event as APIGatewayEvent).body);

    const { piid, cancellation_reason } = requestData;
    if (! piid) {
        return callBack('Must provide the PaymentIntentID');
    }

    const reason: Stripe.PaymentIntentCancelParams.CancellationReason = cancellation_reason ?? 'abandoned';

    try {
        const paymentIntent = await stripe.paymentIntents.cancel(piid, {
            cancellation_reason: reason
        });

        return successHandler(callBack, {
            message: 'Payment cancelled!',
            PaymentIntent: paymentIntent,
        });
    }
    catch(error) {
        return errorHandler(callBack,'Error: cancelPaymentIntent FAILED with exception!', error);
    }
}
