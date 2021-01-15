import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { Stripe_API_Version } from '../../config';
import { Stripe } from 'stripe';
import {errorHandler, successHandler} from "../../utils/apiResponse";

export const createTerminalConnection: Handler = async (event: APIGatewayEvent | ScheduledEvent) => {
    const config: Stripe.StripeConfig = {
        apiVersion: Stripe_API_Version,
        typescript: true,
    };
    const stripe = new Stripe(process.env.STRIPE_API_KEY, config);
    console.log('config', process.env);

    try {
        const terminalToken = await stripe.terminal.connectionTokens.create();
        console.log('terminalToken', terminalToken);
        return successHandler({
            success: true,
            message: 'Terminal Connection Created!',
            terminalToken: terminalToken,
        });
    } catch (err) {
        return errorHandler('Terminal Connection FAILED!', err);
    }
}

