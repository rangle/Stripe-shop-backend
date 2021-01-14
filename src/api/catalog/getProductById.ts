import { APIGatewayEvent, Handler } from 'aws-lambda';
import { getItemFromCatalog, getItemsFromCatalog } from '../../services/db/catalogUtils/getCatalogItems';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { ProductInput } from '@types';

export const getProductById: Handler = async (
  event: APIGatewayEvent,
) => {

  const { id, version }: {id: string, version:string} = JSON.parse((event as APIGatewayEvent).body);

  console.log('itemType', { id, version });

  if (! (id && version)) {
    return errorHandler('ERROR: must supply both ID and Version of partition key.', []);
  }

  try {
    const item = await getItemFromCatalog(id, version);
    return successHandler(item);
  } catch (error) {
    return errorHandler("ERROR: Couldn't fetch the products.", error);
  }
};
