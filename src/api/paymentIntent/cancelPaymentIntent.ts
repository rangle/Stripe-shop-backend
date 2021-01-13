import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { Stripe} from 'stripe';
import { errorHandler, successHandler } from '../../utils/apiResponse';

export const cancelPaymentIntent: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,

) => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: '2020-08-27',
        typescript: true,
    });

    const requestData: any = JSON.parse((event as APIGatewayEvent).body);

    const { piid, cancellation_reason } = requestData;
    if (! piid) {
    return 'Must provide the PaymentIntentID';
    }

    const reason: Stripe.PaymentIntentCancelParams.CancellationReason = cancellation_reason ?? 'abandoned';

    try {
        const paymentIntent = await stripe.paymentIntents.cancel(piid, {
      cancellation_reason: reason,
        });

    return successHandler({
            message: 'Payment cancelled!',
            PaymentIntent: paymentIntent,
        });
    }
    catch(error) {
    return errorHandler('Error: cancelPaymentIntent FAILED with exception!', error);
    }
};
