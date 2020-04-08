import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe } from 'stripe';

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
        return callBack(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                    success: true,
                    message: 'SUCCESS payment intent captured!',
                    paymentIntent: paymentIntent,
                },
                null,
                2,
            ),
        });
    } catch (err) {
        return callBack(null, {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                    success: false,
                    message: 'FAILURE payment intent not captured!',
                    PaymentIntent: err,
                },
                null,
                2,
            ),
        });
    }
}

