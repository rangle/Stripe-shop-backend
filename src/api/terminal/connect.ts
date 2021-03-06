import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe } from 'stripe';
import {errorHandler, successHandler} from "../../utils/apiResponse";

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
        return successHandler(callBack, {
            success: true,
            message: 'Terminal Connection Created!',
            terminalToken: terminalToken,
        });
    } catch (err) {
        return errorHandler(callBack, 'Terminal Connection FAILED!', err);
    }
}

