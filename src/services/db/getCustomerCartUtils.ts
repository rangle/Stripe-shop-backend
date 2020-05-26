import {dynamoDb, search} from "../../utils/db";

export const getCustomerItems = async (customerId: string): Promise<CartItems> => {
        console.log('customerId', customerId)
        const params = {
            TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
            FilterExpression: 'customerId = :id',
            ExpressionAttributeValues: {':id': customerId},
        };
        const customerItems =  await search(params);
        console.log('customerItems', customerItems);
        return customerItems;
};

export const getSubscriptionItems = (items: CartItems): Promise<SubscriptionItems> => {
    return new Promise((resolve, reject) => {
        let filterExpressionKeys = {};
        for (let i = 0; i < items.length; i++) {
            filterExpressionKeys[':p' + i] = items[i].productId;
        }

        const params = {
            TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
            FilterExpression: 'productId IN (' + Object.keys(filterExpressionKeys).join(',') + ')',
            ExpressionAttributeValues: filterExpressionKeys,
        };
        console.log('getSubscriptionItems.params', params);
        try {
            dynamoDb.scan(params, (error, result) => {
                // handle potential errors
                console.log('results', result);
                if (! result) {
                    return reject({message: 'ERROR: getSubscriptionItems.DB empty'});
                }
                if (error) {
                    return reject({message: 'ERROR: getSubscriptionItems.DB', error});
                }
                // create a response
                console.log('getSubscriptionItems results: ', result);

                return resolve(result.Items);
            });
        } catch (error) {
            return reject({message: 'ERROR: getSubscriptionItems', error});
        }
    });
};


export const getItemProductAmounts = (items: CartItems): Promise<OrderItems> => {
    return new Promise((resolve, reject) => {
        let filterExpressionKeys = {};
        for (let i = 0; i < items.length; i++) {
            filterExpressionKeys[':p' + i] = items[i].productId;
        }

        const params = {
            TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
            FilterExpression: 'productId IN (' + Object.keys(filterExpressionKeys).join(',') + ')',
            ExpressionAttributeValues: filterExpressionKeys
        };
        try {
            dynamoDb.scan(params, (error, result) => {
                // handle potential errors
                console.log('results', result);
                if (! result) {
                    return reject({message: 'ERROR: getItemProductAmounts.DB empty'});
                }
                if (error) {
                    return reject({message: 'ERROR: getItemProductAmounts.DB', error});
                }
                // create a response
                console.log('productAmounts results: ', result);
                return resolve(result.Items);
            });
        } catch (error) {
            return reject({message: 'ERROR: getItemProductAmounts', error});
        }
    });
};

//
// export const getOrderTotal = (customerID: string) => {
//
//     const customerItems = getCustomerItems(customerID);
//     const products = Object.values(customerItems).map((item,i,accumulator) => {
//         accumulator[':val' + i] = item.productId;
//     });
//     console.log('products', products);
//     const myProductAmounts = getItemProducts(products);
//
//     return Object.values(myProductAmounts).reduce((total, product) => product.amount + total);
// }

