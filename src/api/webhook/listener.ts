import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { successHandler } from "../../utils/apiResponse";

export const webhookListener: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {
    const data = JSON.parse((event as APIGatewayEvent).body);

    console.log({ "Webhook data": data })

    return successHandler(callBack, {
        received: true,
    });
}

