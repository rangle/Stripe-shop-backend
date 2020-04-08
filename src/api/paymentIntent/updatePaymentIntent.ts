import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe } from 'stripe';

export const createPaymentIntent: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
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
        capture_method,
        off_session,
    } = requestData;

    const valid_payment_method_types = (payment_method_types) ? payment_method_types : ['card'];
    const valid_capture_method = (capture_method == 'manual') ? capture_method : 'automatic';
    // const valid_setup_future_usage = (off_session) ? 'off_session' : 'on_session';
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: valid_payment_method_types,
            capture_method: valid_capture_method,
            // setup_future_usage: valid_setup_future_usage,
        });
        return callBack(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                    message: 'Payment Intent Created!',
                    PaymentIntent: paymentIntent,
                },
                null,
                2,
            ),
        });
    }
    catch(error) {
        callBack(null,{
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                    message: 'ERROR Payment Intent Creation FAILED!',
                    errorDetails: error,
                },
                null,
                2,
            ),
        });
    }
}
