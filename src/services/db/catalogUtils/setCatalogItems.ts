import { DocumentClient } from "aws-sdk/clients/dynamodb";
import uuid = require("uuid");
import { ItemTypes, ProductInput } from "../../../types";
import { columnMapProducts } from "../../../utils/constants/products_entity_constants";

const initVersionCode = (type: ItemTypes) => {
    const timestamp = new Date().getTime();
    return 'V0_' + type + '_' + timestamp;
}

export const addNewProduct = (data: ProductInput, currency: string): DocumentClient.PutItemInput => {
    const params: DocumentClient.PutItemInput = {
        TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
        Item: {
            product: {
                name: data.name,
                description: data.description,
                amount: data.amount,
                currency: currency,
            },
        },
    };
    params.Item[columnMapProducts.itemType] = data.itemType;
    params.Item[columnMapProducts.productId] = uuid.v1();
    params.Item[columnMapProducts.versionCode_Date] = initVersionCode(data.itemType);
    params.Item[columnMapProducts.rating] = 0;
    params.Item[columnMapProducts.category] = data.category;
    return params;
}

export const makeSubscription = (params: DocumentClient.PutItemInput, props: any) => {
    const updated = {
        ...params,
        Item: {
            ...params.Item,
            stripe: props.stripeId,
            interval_options: props.interval_options
        }
    }
    return updated;
}

