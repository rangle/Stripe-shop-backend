import { Stripe } from 'stripe';

export const createCustomer = async (stripe, customer: CustomerInput) => {

    const params: Stripe.CustomerCreateParams = {
        name: customer.name,
        email: customer.email,
        phone: String(customer.phone),
        address: {
           line1: customer.address?.address1,
           line2: customer.address?.address2,
           city: customer.address?.city,
           state: customer.address?.province,
           postal_code: customer.address?.postalCode,
           country: customer.address?.country,
        },
    };

    // Create a Customer:
    const stripeCustomer: Stripe.Customer = await stripe.customers.create(params);

    return stripeCustomer;

};
