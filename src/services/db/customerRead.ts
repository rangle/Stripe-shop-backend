import {query} from "../../utils/db";
import { Customer } from 'src/types';

export const customerRead = async (customerId: string): Promise<Customer> => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE_SHOPPING,
        Key: {
            customerId: customerId,
        },
    };

    const customer = await query(params);
    console.log('customer', customer);
    return customer.Item;
}
