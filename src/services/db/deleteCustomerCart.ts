import {get} from "../../utils/db";

export const delCustomerCart = async (customerId: string): Promise<Boolean> => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
        FilterExpression: 'customerId = :id',
        ExpressionAttributeValues: {':id': customerId},
    };

    const customer = await get(params);
    console.log('customer', customer);
    return customer.Item;
}
