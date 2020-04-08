
type PIMetaData = {
    [name: string]: string | number | null;
};

type DbError = {
    [key: string]: string
};

type Currency = 'cad' | 'usd';

type Product = {
    productId: string,
    name: string,
    description: string,
    amount: number,
    currency: Currency,
    createdAt: number,
    updatedAt: number,
};

type Products = Product[];


type ProductTable = {
    TableName: string,
    Item: Product,
};

type PaymentCommon = {
    amount: number,
    payment_method_types?: string[],
    capture_method?: 'automatic' | 'manual',
    off_session?: boolean,
    setup_future_usage?: 'off_session' | 'on_session',
    confirm?: boolean,
    customer?: string,
    description?: string,
    metadata?: PIMetaData,
}

type PaymentInput = PaymentCommon & {
    orderId?: string,
    currency?: Currency,
};

type PaymentIntent = PaymentCommon & {
    currency: Currency,
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
    address1: string,
    address2?: string,
    city: string,
    province?: string,
    country: string,
    postalCode: string,
};

type CustomerInput = {
    name?: string,
    email?: string,
    phone?: number,
    address?: Address,
    StripeCustomerId?: string
};

type Customer = CustomerInput & {
    customerId: string,
    createdAt: number,
    updatedAt: number,
};

type validCustomer = {
    isValid: boolean,
    error?: Error,
    params?: Customer,
};

type CustomerTable = {
    TableName: string,
    Item?: Customer,
};

type PostCartItem = {
    customer: string,
    item: string,
};

type CartItem = {
    cartItemId: string,
    customerId: string,
    productId: string,
    quantity: number,
    createdAt?: number,
    updatedAt?: number,
};

type CartItems = CartItem[];

type CartTable = {
    TableName: string,
    Item: CartItem,
};

type OrderItem = {
    name: string,
    description?: string,
    amount: number,
    quantity: number,
};

type OrderItems = OrderItem[];

type Validation = {
    errors?: DbError,
    params?: PaymentIntent,
    isValid: boolean,
};

