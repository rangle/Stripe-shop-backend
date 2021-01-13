import { APIGatewayEvent, Handler } from 'aws-lambda';
import { getItemsFromCatalog } from '../../services/db/catalogUtils/getCatalogItems';
import { ItemTypes } from '../../types';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { itemTypes } from '../../utils/constants/shopping_entity_constants';

export const getProducts: Handler = async (
  event: APIGatewayEvent,
) => {
  // const limit: number = 10;
  // const search: string = '';
  const type: string | undefined = event.pathParameters?.type;
  const itemType: ItemTypes = type && Object.keys(itemTypes).indexOf(type) ? itemTypes[type] : 'product';

  try {
    console.log('itemType', itemType);
    const catalog = await getItemsFromCatalog(itemType);
    return successHandler(catalog);
  } catch (error) {
    return errorHandler("ERROR: Couldn't fetch the products.", error);
  }
};
