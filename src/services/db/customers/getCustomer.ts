import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { columnMapShopping, CUSTOMER, CUSTOMER_PREFIX, EMAIL_PREFIX, indexMapShopping, PHONE_PREFIX } from '../../../utils/constants/shopping_entity_constants';
import { query } from '../../../utils/db';


export const getCustomerById = async ({customerId}: {customerId: string}) => {
    const params: DocumentClient.QueryInput = {
        TableName: process.env.DYNAMODB_TABLE_SHOPPING,
        KeyConditionExpression: `${columnMapShopping.customerRecord} = :cKey and customerID = :cId`,
        ExpressionAttributeValues: {
            ":cKey": CUSTOMER,
            ":cId1": CUSTOMER_PREFIX + customerId,
        },
    };
    return await query(params);
}

export const getCustomerByEmail = async ({email}: {email: string}) => {
    const params: DocumentClient.QueryInput = {
        TableName: process.env.DYNAMODB_TABLE_SHOPPING,
        IndexName: indexMapShopping.byEmail,
        KeyConditionExpression: `${columnMapShopping.customerEmail} = :email`,
        ExpressionAttributeValues: {
            ":email": EMAIL_PREFIX + '_' + email,
        },
    };
    return await query(params);
}

export const getCustomerDetailByPhone = async ({phone}: {phone: string}) => {
    const phone_stripped = phone.replace(/[^0-9]/g, '');
    const params: DocumentClient.QueryInput = {
        TableName: process.env.DYNAMODB_TABLE_SHOPPING,
        IndexName: indexMapShopping.byPhone,
        KeyConditionExpression: `${columnMapShopping.customerPhone} = :phone`,
        ExpressionAttributeValues: {
            ":phone": PHONE_PREFIX + '_' + phone_stripped,
        },
    };
    return await query(params);
}

export const getCustomerByRegion = async ({region}: {region: string}) => {
    const params: DocumentClient.QueryInput = {
        TableName: process.env.DYNAMODB_TABLE_SHOPPING,
        IndexName: indexMapShopping.byRegion,
        KeyConditionExpression: `${columnMapShopping.customerRecord} = :cKey and begins_with(${columnMapShopping.customerRegion}, :r1)`,
        ExpressionAttributeValues: {
            ":cKey": CUSTOMER,
            ":r1": region.toUpperCase(),
        },
    };
    return await query(params);
}