import {upsert} from "../../utils/db";


export const customerWrite =  async (validCustomer: Customer): Promise<Customer> => {
    try {
        const params: CustomerTable = {
            TableName: process.env.DYNAMODB_TABLE_SH,
            Item: validCustomer,
        };
        const customer: Customer = await upsert(params);
        return customer;
    } catch(error) {
        throw(error);
    }
}
