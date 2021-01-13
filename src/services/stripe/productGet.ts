import { Stripe } from 'stripe';
import { Stripe_API_Version } from '../../config';

export const productById = async (id: string): Promise<Stripe.Product> => {
  const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: Stripe_API_Version,
    typescript: true,
  });

  const product = await stripe.products.retrieve(id);
  return product
}

export const productGet = async (limit: number, starting_after: string): Promise<Stripe.Product[]> => {
  const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: Stripe_API_Version,
    typescript: true,
  });
  const params: Stripe.SkuListParams = {
    limit,
    starting_after,
  }

  const skus = await stripe.products.list(params);
  return skus.data;
};

