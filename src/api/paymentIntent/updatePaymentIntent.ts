import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { Stripe } from 'stripe';
import {errorHandler, successHandler} from "../../utils/apiResponse";

/**
 * Utility that should never be used in a Production environment.
 * Use startPayment to create or update the payment intent based on the Customer's Cart.
 */
export const updatePaymentIntent: Handler = async (event: APIGatewayEvent | ScheduledEvent) => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: '2020-08-27',
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
        return successHandler({
                    message: 'Payment Intent Created!',
                    PaymentIntent: paymentIntent,
                });
    }
    catch(error) {
        errorHandler('Error: createPaymentIntent failed with an exception!', error);
    }
}
