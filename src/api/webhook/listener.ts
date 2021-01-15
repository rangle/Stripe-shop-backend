import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { successHandler } from "../../utils/apiResponse";

export const webhookListener: Handler = async (event: APIGatewayEvent | ScheduledEvent) => {
    const data = JSON.parse((event as APIGatewayEvent).body);

    console.log({ "Webhook data": data })

    return successHandler({
        received: true,
    });
}

