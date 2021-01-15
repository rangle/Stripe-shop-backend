import {customerUpdate} from "./customerUpdate";
import {customerCreate} from "./customerCreate";
import { CustomerInput } from '../../types';

export async function stripeCustomerUpsert(validCustomer: CustomerInput) {
    console.log('HERE upsertToStripe', validCustomer);
    const stripeCustomer = (validCustomer.StripeCustomerId)
        ? await customerUpdate(validCustomer)
        : await customerCreate(validCustomer);

    return stripeCustomer;
}
