export const Stripe_API_Version = '2020-08-27';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace NodeJS {
  export interface ProcessEnv {
    STRIPE_API_KEY: string;
    DYNAMODB_TABLE_ORDERS: string;
  }
}
