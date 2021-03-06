import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { Stripe } from 'stripe';
import {errorHandler, successHandler} from "../../utils/apiResponse";
import {getCustomerItems, getItemProductAmounts} from "../../services/getCustomerCartItems";
import {createCustomer} from "../../services/stripe/createCustomer";
import {validatePaymentIntent} from "../../utils/PaymentIntentValidation";
import {rejects} from "assert";

export const startPayment: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    const {
        customerId,
        payment_method_types,
        capture_method = 'automatic',
        billing_details=undefined,
        saveCustomer=false,
    }: any = JSON.parse((event as APIGatewayEvent).body);

    try {
        const items = await getCustomerItems(customerId);
        if (! items.length) {
            return errorHandler(
                callBack,
                'ERROR startPayment FAILED!',
                'Your Cart is Empty',
            );
        };

        const products = await getItemProductAmounts(items);
        const total: number = products.reduce((acc, prod) => acc += prod.amount, 0);
        const stripePI: PaymentInput = {
            amount: total,
            currency: 'usd',
        }
        if (payment_method_types) {
            stripePI.payment_method_types = payment_method_types;
        }
        if (capture_method) {
            stripePI.capture_method = capture_method;
        }
        const results: Validation  = validatePaymentIntent(stripePI);
        if (!results.isValid) {
            return errorHandler(
                callBack,
                'ERROR The PaymentIntent contains invalid data!',
                results.errors,
            );
        };

        const stripe = new Stripe(process.env.STRIPE_API_KEY, {
            apiVersion: process.env.STRIPE_API_VERSION,
            typescript: true,
        });

        if (saveCustomer) {
            if(billing_details) {
                const stripeCustomer = await createCustomer(billing_details);
                results.params.customer = stripeCustomer.id;
            }
        }
        const paymentIntent = await stripe.paymentIntents.create(results.params);
        return successHandler(
            callBack,
            {
                message: 'startPayment Created!',
                paymentIntent,
         });
    }
    catch(error) {
        return errorHandler(
            callBack,
            'ERROR startPayment FAILED!',
            error
        );
    }
}
