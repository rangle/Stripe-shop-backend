import { APIGatewayEvent, Handler } from 'aws-lambda';
import { getItemsFromCatalog } from '../../services/db/catalogUtils/getCatalogItems';
import { ItemTypes } from '../../types';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { allTypes, itemTypes } from '../../utils/constants/shopping_entity_constants';

export const getProducts: Handler = async (
  event: APIGatewayEvent,
) => {
  // const limit: number = 10;
  // const search: string = '';
  const type: string | undefined = event.pathParameters?.type;
  const itemType: ItemTypes = type && Object.keys(allTypes).indexOf(type) ? allTypes[type] : 'product';

  console.log('itemType', { type, itemType });

  if (! itemType) {
    return errorHandler('ERROR: you requested an invalid Item Type.', []);
  }

  try {
    const catalog = await getItemsFromCatalog(itemType);
    return successHandler(catalog);
  } catch (error) {
    return errorHandler("ERROR: Couldn't fetch the products.", error);
  }
};
