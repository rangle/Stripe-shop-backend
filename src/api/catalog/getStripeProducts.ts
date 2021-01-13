import { Handler } from 'aws-lambda';
import { Stripe } from 'stripe';

import { productGet } from '../../services/stripe/productGet';
import { successHandler } from '../../utils/apiResponse';

export const getStripeProducts: Handler = async () => {
  const limit = 10;
  // This is the last Sku returned by a previous call.
  const starting_after: string | undefined = undefined;

  const products: Stripe.Product[] = await productGet(limit, starting_after);

  return successHandler(products);
};
