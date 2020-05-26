import {customerUpdate} from "./customerUpdate";
import {customerCreate} from "./customerCreate";

export async function upsertToStripe(validCustomer) {
    console.log('HERE upsertToStripe', validCustomer);
    const stripeCustomer = (validCustomer.StripeCustomerId)
        ? await customerUpdate(validCustomer)
        : await customerCreate(validCustomer);

    return stripeCustomer;
}
