import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe} from 'stripe';

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

        return callBack(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                    message: 'Payment cancelled!',
                    PaymentIntent: paymentIntent,
                },
                null,
                2,
            ),
        });
    }
    catch(error) {
        return callBack(null, {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                    message: 'ERROR Payment Intent Cancellation FAILED!',
                    errorDetails: error,
                },
                null,
                2,
            ),
        });
    }
}
