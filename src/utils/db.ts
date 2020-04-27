const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const isOffline = process.env.IS_OFFLINE;
const dynamoDB_endpoint = process.env.CONFIG_DYNAMODB_ENDPOINT;

export const dynamoDb = (isOffline)
    ? new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: dynamoDB_endpoint,
    })
    : new AWS.DynamoDB.DocumentClient();

export const upsert = (params: any) => {
    return new Promise((resolve, reject) => {
        dynamoDb.put(params, (error, result) => {
            if (error) {
                reject({error} );
            } else {
                resolve({result});
            }
        });
    });

};
