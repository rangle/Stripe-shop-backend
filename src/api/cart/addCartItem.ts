import { APIGatewayEvent, ScheduledEvent, Handler } from 'aws-lambda';
import { errorHandler, successHandler } from '../../utils/apiResponse';
import { PostCartItem, Product } from '../../types';
import { getCatalogItem } from '../../services/db/catalogUtils/getCatalogItem';
import { addItemToCustomerCart } from '../../services/db/customerCarts/setItemForCustomer';

export const addCartItem: Handler = async (event: APIGatewayEvent | ScheduledEvent) => {

  const data: PostCartItem = JSON.parse((event as APIGatewayEvent).body);

   const customerId: string = data.customer;

   const itemDetail: Product = await getCatalogItem(data.item);

  const quantity: number = data.quantity || 1;

  try {
    const result = await addItemToCustomerCart({ customerId, itemDetail, quantity, itemType: itemDetail.type });
    return successHandler({
      newItem: result.Item,
    });
  } catch (error) {
    return errorHandler('ERROR: Couldn\'t add the Cart Item.', error);
  }
};
