import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe } from 'stripe';

export const getPaymentIntents: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: process.env.STRIPE_API_VERSION,
        typescript: true,
    });

    const limit: number = 10;

    const paymentIntents = await stripe.paymentIntents.list(
        {
            limit,
        }
    );
    return callBack(null, {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
                message: 'List first ' + limit + ' Payment Intents!',
                PaymentIntent: paymentIntents,
            },
            null,
            2,
        ),
    });
}
