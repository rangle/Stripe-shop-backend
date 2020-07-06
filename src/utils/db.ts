import { errorHandler, successHandler } from './apiResponse';
import 'source-map-support/register';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const isOffline = process.env.IS_OFFLINE;
const dynamoDB_endpoint = process.env.CONFIG_DYNAMODB_ENDPOINT;

export const dynamoDb = isOffline
  ? new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: dynamoDB_endpoint,
    })
  : new AWS.DynamoDB.DocumentClient();

export const upsert = (params: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    // params.ReturnValues = 'ALL_NEW';
    console.log('upsert(params)', params);
    dynamoDb.put(params, (error, result) => {
      if (error) {
        error.source = 'My DynamoDB Exception';
        console.log('DB Error: upsert failed with ', error);
        reject({ error });
      } else {
        console.log('DB SUCCESS: upsert resolved with ', result);
        resolve({ result: params.Item });
      }
    });
  });
};

export const updateItem = (params: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    // params.ReturnValues = 'ALL_NEW';
    console.log('updateItem(params)', params);
    dynamoDb.update(params, (error, result) => {
      if (error) {
        error.source = 'My DynamoDB Exception';
        console.log('DB Error: Item update failed with ', error);
        reject({ error });
      } else {
        console.log('DB SUCCESS: Item update resolved with ', params.Item);
        resolve({ result: params.Item });
      }
    });
  });
};

export const batchDelete = async (params, data, key) => {
  const log = [];
  await data.reduce(async (acc, item) => {
    console.log('batchDelete: item', item);
    params.Key[key] = item;
    try {
      await deleteItem(params);
      console.log('post batchDelete item', item);
      log.push({ success: item[key] });
    } catch (error) {
      console.log('post batchDelete item', item);
      log.push({ failed: item[key] });
    }
  }, []);
  return log;
};

export const deleteItem = (params: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    dynamoDb.delete(params, (error, result) => {
      if (error) {
        error.source = 'My DynamoDB Exception';
        console.log('DB Error: Item delete failed with ', { params, error });
        reject({ error });
      } else {
        console.log('DB SUCCESS: Item delete resolved with ', { params, result });
        resolve({ params, result });
      }
    });
  });
};

export const get = (params: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    dynamoDb.get(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        return reject({ error: "ERROR: Couldn't fetch the order", message: error });
      }
      // create a response
      return resolve(result);
    });
  });
};

export const search = (params: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      dynamoDb.scan(params, (error, result) => {
        // handle potential errors
        if (error) {
          return reject({ message: 'ERROR: DynamoDB.get', error });
        }
        if (!result) {
          return reject({ message: 'ERROR: DynamoDB.get empty' });
        }
        // create a response
        console.log('SUCCESS: DynamoDB.get: ', result);
        return resolve(result.Items);
      });
    } catch (error) {
      return reject({ message: 'ERROR: DynamoDB.get', error });
    }
  });
};

export const update = async (params: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    dynamoDb.update(params, (error, result) => {
      if (error) {
        return reject({ message: 'ERROR: DynamoDb.get' });
      }
    });
  });
};

export const batchUpsert = async (data: any[], table: string): Promise<any[]> => {
  const params: any = {
    TableName: table,
  };
  return await putBatchData(data, params);
};

const putBatchData = async (data: any[], params: any): Promise<any[]> => {
  const log = [];
  await data.reduce(async (acc, item) => {
    params.Item = item;
    try {
      await upsert(params);
      log.push({ success: item.name });
    } catch (error) {
      log.push({ failed: item.name });
    }
  }, []);
  return log;
};

export const updateBatchData = async (data: any[], params: any, key: string): Promise<any[]> => {
  const log = [];
  await data.reduce(async (acc, item) => {
    console.log('updateBatchData: item', item);
    params.Key[key] = item[key];
    try {
      await updateItem(params);
      console.log('post upsert item', item);
      log.push({ success: item[key] });
    } catch (error) {
      console.log('post upsert item', item);
      log.push({ failed: item[key] });
    }
  }, []);
  return log;
};

//
// const delete = async (params: any): Promise<any> => {
//
// };
