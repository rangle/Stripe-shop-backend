import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import {errorHandler, successHandler} from "../../utils/apiResponse";
import {validatePaymentIntent} from "../../utils/PaymentIntentValidation";
import {paymentIntentCreate} from "../../services/stripe/paymentIntentCreate";

export const createPaymentIntent: Handler = async (event: APIGatewayEvent | ScheduledEvent) => {
    const requestData: any = JSON.parse((event as APIGatewayEvent).body);

    const results = validatePaymentIntent(requestData);
    if (! results.isValid) {
        return errorHandler(
            'ERROR The PaymentIntent contains invalid data!',
            results.errors,
        );
    }

    try {
        const paymentIntent = await paymentIntentCreate(results.params);
        return successHandler(
            {
                message: 'Payment Intent Created!',
                PaymentIntent: paymentIntent,
            });
    }
    catch(error) {
        return errorHandler(
            'ERROR Payment Intent Creation FAILED!',
            error
        );
    }
}
