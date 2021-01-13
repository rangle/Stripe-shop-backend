import { APIGatewayEvent, Handler } from 'aws-lambda';
import { getSubscriptionFromCatalog } from '../../services/db/catalogUtils/getCatalogItems';
import { SubscriptionTypes } from '../../types';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import {
  subscriptionPrefix,
  subscriptionTypes,
} from '../../utils/constants/shopping_entity_constants';

export const getSubscriptions: Handler = async (
  event: APIGatewayEvent,
) => {
  // const limit: number = 10;
  // const search: string = '';
  const type: string = event.pathParameters.type;
  const subscriptionType: SubscriptionTypes = Object.keys(subscriptionTypes).indexOf(
    subscriptionPrefix + type
  )
    ? subscriptionTypes[subscriptionPrefix + type]
    : subscriptionTypes[subscriptionPrefix + 'product'];

  try {
    const catalog = await getSubscriptionFromCatalog(subscriptionType);
    return successHandler(catalog);
  } catch (error) {
    console.log('Caught Error = ', { Yo: error.message });
    if (error) {
      return errorHandler(error.message, error);
    }
    return errorHandler("ERROR: Couldn't fetch the products.", error);
  }
};
