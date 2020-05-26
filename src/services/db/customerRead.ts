import {get} from "../../utils/db";

export const customerRead = async (customerId: string): Promise<Customer> => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE_CUSTOMERS,
        Key: {
            customerId: customerId,
        },
    };

    const customer = await get(params);
    console.log('customer', customer);
    return customer.Item;
}
