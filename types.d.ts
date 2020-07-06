type PIMetaData = {
  [name: string]: string | number | null;
};

type DbError = {
  [key: string]: string;
};

type DbLog = {
  [key: string]: string;
}[];

type Currency = 'cad' | 'usd';
type Interval = 'day' | 'week' | 'month' | 'year';
type UsageType = 'licensed' | 'metered';
type ProductId = string;

type Product = {
  productId: ProductId;
  name: string;
  description: string;
  amount: number;
  hasSubscription?: boolean;
  currency: Currency;
  createdAt: number;
  updatedAt: number;
  stripeProductId?: string;
  stripePriceId?: string;
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

// // FROM STRIPE's TYPE FILE
// interface paymentIntentCheckInput {
//     amount: number;
//     currency: string;
//     application_fee_amount?: number;
//     capture_method?: PaymentIntentCreateParams.CaptureMethod;
//     confirm?: boolean;
//     confirmation_method?: PaymentIntentCreateParams.ConfirmationMethod;
//     customer?: string;
//     description?: string;
//     error_on_requires_action?: boolean;
//     expand?: Array<string>;
//     mandate?: string;
//     mandate_data?: PaymentIntentCreateParams.MandateData;
//     off_session?: boolean | PaymentIntentCreateParams.OffSession;
//     on_behalf_of?: string;
//     payment_method?: string;
//     payment_method_options?: PaymentIntentCreateParams.PaymentMethodOptions;
//     payment_method_types?: Array<string>;
//     receipt_email?: string;
//     return_url?: string;
//     save_payment_method?: boolean;
//     setup_future_usage?: PaymentIntentCreateParams.SetupFutureUsage;
//     shipping?: PaymentIntentCreateParams.Shipping;
//     source?: string;
//     statement_descriptor?: string;
//     statement_descriptor_suffix?: string;
//     transfer_data?: PaymentIntentCreateParams.TransferData;
//     transfer_group?: string;
//     use_stripe_sdk?: boolean;
// }
//

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
  customerId: string;
  createdAt: number;
  updatedAt: number;
};

type validCustomer = {
  isValid: boolean;
  error?: Error;
  params?: Customer;
};

type CustomerTable = {
  TableName: string;
  Item?: Customer;
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

type BusinessTable = {
  TableName: string;
  Item?: Business;
};

type PostCartItem = {
  customer: string;
  item: string;
};

type CartItem = {
  cartItemId: string;
  customerId: string;
  productId: ProductId;
  quantity: number;
  createdAt?: number;
  updatedAt?: number;
  OrderPendingId?: string;
};

type CartItems = CartItem[];

type CartTable = {
  TableName: string;
  Item: CartItem;
};

type OrderItem = {
  productId: ProductId;
  cartItemId: string;
  quantity: number;
  subtotal?: number;
};

type OrderItems = OrderItem[];

type OrderInput = {
  customerId: string;
  orderTotal: number;
  shippingAmount: number;
};

type OrderStatus = 'pending' | 'ordered' | 'shipped' | 'delivered';

type Order = OrderInput & {
  orderId: string;
  products: OrderItems;
  createdAt: number;
  updatedAt: number;
  currency?: 'cad' | 'usd';
  orderStatus: OrderStatus;
};

type OrdersTable = {
  TableName: string;
  Item: Order;
};

type SubscriptionItem = {
  productId: string;
  stripePriceId: string;
  quantity?: number;
};

type SubscriptionItems = SubscriptionItem[];

type Validation = {
  errors?: DbError;
  params?: PaymentIntent;
  isValid: boolean;
};
