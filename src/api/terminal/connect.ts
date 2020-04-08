import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe } from 'stripe';

export const createTerminalConnection: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    const config: Stripe.StripeConfig = {
        apiVersion: process.env.STRIPE_API_VERSION,
        typescript: true,
    };
    const stripe = new Stripe(process.env.STRIPE_API_KEY, config);
    console.log('config', process.env);

    try {
        const terminalToken = await stripe.terminal.connectionTokens.create();
        console.log('terminalToken', terminalToken);
        return callBack(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                    success: true,
                    message: 'Terminal Connection Created!',
                    terminalToken: terminalToken,
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
                    message: 'Terminal Connection FAILED!',
                    PaymentIntent: err,
                },
                null,
                2,
            ),
        });
    }
}

