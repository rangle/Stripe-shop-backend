import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { stripeCustomerUpsert } from '../../services/stripe/stripeCustomerUpsert';
import { CustomerInput } from '../../types';
import { setCustomer } from '../../services/db/customers/setCustomer';

export const addCustomer: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,
) => {
  const customerInput: CustomerInput = JSON.parse((event as APIGatewayEvent).body);
  console.log('incomming data', customerInput);

  try {
    if (customerInput.isStripeCustomer) {
      const stripeCustomer = await stripeCustomerUpsert(customerInput);
      customerInput.StripeCustomerId = stripeCustomer.id;
      console.log('stripeCustomer', stripeCustomer);
      delete customerInput.isStripeCustomer;
    }
    const savedCustomer = await setCustomer({ customerDetails: customerInput });
    console.log('savedData', savedCustomer);

    return successHandler({
      message: 'Stripe Customer Created!',
      stripeCustomer: savedCustomer,
    });
  } catch (error) {
    return errorHandler('ERROR Customer Creation FAILED!', error);
  }
};
