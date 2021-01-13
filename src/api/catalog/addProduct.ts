import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { upsert } from '../../utils/db';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { productCreate } from '../../services/stripe/productCreate';
import { ProductInput } from '../../types';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { validateItem } from '../../utils/itemValidation';
import { addNewProduct, makeSubscription } from '../../services/db/catalogUtils/setCatalogItems';
import { productById } from '../../services/stripe/productGet';

const createSubscription = async (data: ProductInput, params: DocumentClient.PutItemInput) => {
  const stripeProduct = await productCreate({
    name: data.name,
    description: data.description,
  });
  return makeSubscription(params, { ...data, stripeId: stripeProduct.id });
};

const getSubscription = async (data: ProductInput, params: DocumentClient.PutItemInput) => {
  if (data.stripeId) {
    const product = productById(data.stripeId);
    console.log('attached Stripe product to this product', {data, product});
    return makeSubscription(params, { ...data, stripeId: data.stripeId });
  }
  return data.hasSubscription ? await createSubscription(data, params) : {};
}

export const addProduct: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,
) => {

  try {
    const data: ProductInput = JSON.parse((event as APIGatewayEvent).body);

    const currency = data.currency || 'cad';

    const errors: any[] = validateItem(data.itemType, data);
    if (errors.length) {
      console.log('errors', errors);
      throw new Error(
        'You are missing the following required properties: ' + errors.join(', ') + '.'
      );
}
    const params: DocumentClient.PutItemInput = addNewProduct(data, currency);

    const subscription = await getSubscription(data, params);
    const result = await upsert({ ...params, ...subscription });

    console.log('result', result);
    return successHandler({ productId: result.item });
  } catch (error) {
    console.log('Caught Error = ', { Yo: error.message });
    if (error) {
      return errorHandler(error.message, error);
    }
    return errorHandler('Error: addProduct failed with exception.', error);
  }
};
