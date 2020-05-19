import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import {errorHandler, successHandler} from "../../utils/apiResponse";
import {validatePaymentIntent} from "../../utils/PaymentIntentValidation";
import {paymentIntentCreate} from "../../services/stripe/paymentIntentCreate";

export const createPaymentIntent: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    const requestData: any = JSON.parse((event as APIGatewayEvent).body);

    const results = validatePaymentIntent(requestData);
    if (! results.isValid) {
        return errorHandler(
            callBack,
            'ERROR The PaymentIntent contains invalid data!',
            results.errors,
        );
    }

    try {
        const paymentIntent = await paymentIntentCreate(results.params);
        return successHandler(
            callBack,
            {
                message: 'Payment Intent Created!',
                PaymentIntent: paymentIntent,
            });
    }
    catch(error) {
        return errorHandler(
            callBack,
            'ERROR Payment Intent Creation FAILED!',
            error
        );
    }
}
