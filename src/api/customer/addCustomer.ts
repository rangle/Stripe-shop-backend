import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { validateCustomer } from '../../utils/CustomerValidations';
import { stripeCustomerUpsert } from '../../services/stripe/stripeCustomerUpsert';
import { customerWrite } from '../../services/db/customerWrite';

type saveCustomer = {
  isSaveCustomer: number;
};

export const addCustomer: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,
  context: Context,
  callBack: Callback
) => {
  const data: CustomerInput & saveCustomer = JSON.parse((event as APIGatewayEvent).body);
  console.log('incomming data', data);
  const validCustomer: validCustomer = validateCustomer(data);

  if (!validCustomer.isValid) {
    return errorHandler(callBack, 'ERROR: Customer contains invalid data.', validCustomer.error);
  }

  try {
    console.log('stripeCustomer', validCustomer);
    if (data.isSaveCustomer === 1) {
      const stripeCustomer = await stripeCustomerUpsert(validCustomer.params);
      validCustomer.params.StripeCustomerId = stripeCustomer.id;
      console.log('stripeCustomer', stripeCustomer);
    }

    const savedCustomer = await customerWrite(validCustomer.params);
    console.log('savedData', savedCustomer);

    return successHandler(callBack, {
      message: 'Stripe Customer Created!',
      stripeCustomer: savedCustomer,
    });
  } catch (error) {
    return errorHandler(callBack, 'ERROR Customer Creation FAILED!', error);
  }
};
