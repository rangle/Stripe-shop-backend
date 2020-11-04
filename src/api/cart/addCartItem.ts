import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { upsert } from '../../utils/db';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { Item, PostCartItem, Product } from 'src/types';
import { getCatalogItemByItemId } from '@/services/CatalogUtils/getCatalogItemByItemId';
import { columns } from '@/utils/constants/db_entity_constants';

export const addCartItem: Handler = async (event: APIGatewayEvent | ScheduledEvent, context: Context, callBack: Callback) => {


  const data: PostCartItem = JSON.parse((event as APIGatewayEvent).body);
  const timestamp = new Date().getTime();

   const customerId: string = data.customer;
   const item: Product = await getCatalogItemByItemId(data.item);

   const itemId = columns.itemId

  try {
    await addItemToCustomer({ customerId, item });
    return successHandler(callBack, {
      newItem: params.Item,
    });
  } catch (error) {
    return errorHandler(callBack, 'ERROR: Couldn\'t add the Cart Item.', error);
  }
};
