import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';

type PIMetaData = {
  [name: string]: string | number | null;
};

type DbError = {
  message: string,
  error?: Error | string,
}

type DbLog = {
  [key: string]: string;
}[];

type Currency = 'cad' | 'usd';
type Interval = 'day' | 'week' | 'month' | 'year';
type UsageType = 'licensed' | 'metered';
type ProductId = string;

type Product = {
  productId: ProductId;
  itemType?: ItemTypes;
  name: string;
  description: string;
  amount: number;
  hasSubscription?: boolean;
  currency: Currency;
  createdAt: number;
  updatedAt: number;
  stripe?: {
    Id: string,
    ProductId?: string,
    PriceId?: string;
  };
  interval?: string;
};

type Products = Product[];

type StripeProductInput = {
  name: string;
  description: string;
};

type StripeProduct = StripeProductInput & {
  id: ProductId;
};

type StripePriceInput = {
  product: string;
  unit_amount: number;
  currency: string;
  interval: Interval;
  usage_type?: UsageType;
};

type StripePrice = {
  id?: string;
  product: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: Interval;
    usage_type?: UsageType;
  };
};

type StripeSubscriptionItems = {
  price: string;
  quantity: number;
};

type StripeSubscription = {
  customer: string;
  items: StripeSubscriptionItems[];
};

type SubscriptionItem = {
  productId: string;
  stripePriceId: string;
  quantity?: number;
};

type SubscriptionItems = SubscriptionItem[];

type ProductTable = {
  TableName: string;
  Item: Product;
};

type PaymentCommon = {
  amount: number;
  payment_method_types?: string[];
  capture_method?: 'automatic' | 'manual';
  off_session?: boolean;
  setup_future_usage?: 'off_session' | 'on_session';
  confirm?: boolean;
  customer?: string;
  description?: string;
  metadata?: PIMetaData;
};

type PaymentInput = PaymentCommon & {
  orderId?: string;
  currency?: Currency;
};

type PaymentIntent = PaymentCommon & {
  currency: Currency;
};

type Address = {
  line1: string;
  line2?: string;
  city: string;
  province?: string;
  country: string;
  postalCode: string;
};

type CustomerInput = {
  customerId?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: Address;
  StripeCustomerId?: string;
};

type Customer = CustomerInput & {
  createdAt: number;
  updatedAt: number;
};

type ValidCustomer = {
  isValid: boolean;
  error?: Error;
  params?: Customer;
};

type BusinessInput = {
  businessName: string;
  contactName?: string;
  email: string;
  phone?: string;
  address: Address;
  info?: string;
  website?: string;
};

type Business =
  | BusinessInput
  | {
      businessId: string;
      createdAt: number;
      updatedAt: number;
    };

type validBusiness = {
  isValid: boolean;
  errors?: DbError;
  params?: Business;
};

type PostCartItem = {
  customer: string;
  item: string;
};

type OrderStatuses = 'inCart' |  'ordered' | 'paid' | 'shipped' | 'delivered';
type ItemTypes = 'product' | 'licence' | 'service' | 'subscription';

type Item = {
  product: Product;
  quantity: number;
  createdAt?: number;
  updatedAt?: number;
  orderStatus: OrderStatuses;
};

type UpsertItem = Item & {
  SK: string, // `ITEM_${uuid}`
  PK: string, // CustomerId
}

type Items = Item[];

type Validation = {
  errors?: DbError;
  params?: PaymentIntent;
  isValid: boolean;
};

type OnlyTableName = {
  TableName: DocumentClient.TableName;
}
