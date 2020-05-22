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
                error.source = 'DynamoDB Exception';
                console.log('DB Error: upsert failed with ', error);
                reject({error} );
            } else {
                resolve({result});
            }
        });
    });
};

export const batchUpsert = async (data: any[], table: string): Promise<any[]> => {
    const params: any = {
        TableName: table,
    };
    return await putBatchData(data, params);
}

const putBatchData = async (data: any[], params: any): Promise<any[]> => {
    const log = [];
    await data.reduce(async (acc, item) => {
        params.Item = item;
        try {
            await upsert(params);
            log.push({success: item.name});

        } catch (error) {
            log.push({failed: item.name});
        };
    }, []);
    return log;
};
