import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import getCatalogUtil from '../../services/CatalogUtils/getCatalogUtils';

export const getProducts: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,
  context: Context,
  callBack: Callback
) => {
  const limit: number = 10;
  const search: string = '';

  try {
    const catalog = await getCatalogUtil({ search, limit });
    return successHandler(callBack, catalog);
  } catch (error) {
    return errorHandler(callBack, "ERROR: Couldn't fetch the products.", error);
  }
};
