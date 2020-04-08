declare namespace NodeJS {
    export interface ProcessEnv {
        STRIPE_API_VERSION: '2020-03-02';
        STRIPE_API_KEY: string;
        DYNAMODB_TABLE_ORDERS: string;
    }
}
