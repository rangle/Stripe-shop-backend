import 'source-map-support/register';
import { APIGatewayEvent, ScheduledEvent, Callback, Context, Handler } from 'aws-lambda';
import { batchUpsert } from '../../utils/db';
import { errorHandler, successHandler } from '../../utils/apiResponse';

type Product = {
  productId: string;
  name: string;
  description: string;
  amount: number;
  currency: 'cad' | 'usd';
  createdAt: number;
  updatedAt: number;
  stripeProductId?: string;
  stripePriceId?: string;
  interval?: Interval;
};

type ProductTable = {
  TableName: string;
  Item?: Product;
};

type ImportProduct = {
  Items: Product[];
  Count: number;
  ScannedCount: number;
};

console.log('process.env.DYNAMODB_TABLE_PRODUCTS', process.env.DYNAMODB_TABLE_PRODUCTS);

export const importProducts: Handler = async (
  event: APIGatewayEvent | ScheduledEvent,
  context: Context,
  callBack: Callback
) => {
  const products: ImportProduct = JSON.parse((event as APIGatewayEvent).body);
  try {
    const results = await batchUpsert(products.Items, process.env.DYNAMODB_TABLE_PRODUCTS);
    console.log('results', results);
    return successHandler(callBack, { results });
  } catch (error) {
    console.log('importProducts caught an error', error);
    return errorHandler(callBack, 'error in importProducts', error);
  }
};
