import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { Stripe_API_Version } from '../../config';
import { updateCustomerOrderAddPayment } from '../../services/db/customerOrderUtils';
import { Stripe } from 'stripe';
import { errorHandler, successHandler } from '../../utils/apiResponse';

export const capturePaymentIntent: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,

) => {
  const config: Stripe.StripeConfig = {
    apiVersion: Stripe_API_Version,
    typescript: true,
  };
  const stripe = new Stripe(process.env.STRIPE_API_KEY, config);
  console.log('config', config);

  const data = JSON.parse((event as APIGatewayEvent).body);

  try {
    const paymentIntent = await stripe.paymentIntents.capture(data.pi_id);
    console.log('paymentIntent capture', paymentIntent);
    if (data.orderId && data.customerId) {
      updateCustomerOrderAddPayment({
        customerId: data.customerId,
        itemId: data.itemId,
        payment: paymentIntent.amount,
      });
    }
    return successHandler({
      success: true,
      message: 'SUCCESS payment intent captured!',
      paymentIntent: paymentIntent,
    });
  } catch (err) {
    return errorHandler('FAILURE payment intent not captured!', err);
  }
};
