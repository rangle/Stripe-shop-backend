const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { OnlyTableName } from 'src/types';

const isOffline = process.env.IS_OFFLINE;
const dynamoDB_endpoint = process.env.CONFIG_DYNAMODB_ENDPOINT;

export const dynamoDb = isOffline
  ? new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: dynamoDB_endpoint,
    })
  : new AWS.DynamoDB.DocumentClient();

export const upsert = (params: DocumentClient.PutItemInput): Promise<any> => {
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
        resolve({ item: params.Item });
      }
    });
  });
};

export const updateItem = (params: DocumentClient.UpdateItemInput): Promise<any> => {
  return new Promise((resolve, reject) => {
    // params.ReturnValues = 'ALL_NEW';
    console.log('updateItem(params)', params);
    dynamoDb.update(params, (error, result) => {
      if (error) {
        error.source = 'My DynamoDB Exception';
        console.log('DB Error: Item update failed with ', error);
        reject({ error });
      } else {
        console.log('DB SUCCESS: Item update resolved with ', params.Key);
        resolve({ result: params.Key });
      }
    });
  });
};

export const batchDelete = async (params, data: DocumentClient.ItemList, key) => {
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

export const deleteItem = (params: DocumentClient.DeleteItemInput): Promise<any> => {
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

export const scan = (params: DocumentClient.ScanInput): Promise<any> => {
  return new Promise((resolve, reject) => {
    dynamoDb.scan(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        return reject({ error: "ERROR: Couldn't scan table" + params.TableName, message: error });
      }
      // create a response
      return resolve(result);
    });
  });
};

export const query = (params: DocumentClient.QueryInput): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      dynamoDb.query(params, (error, result) => {
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

export const update = async (params: DocumentClient.UpdateItemInput): Promise<any> => {
  return new Promise((resolve, reject) => {
    dynamoDb.update(params, (error, result) => {
      if (error) {
        return reject({ message: 'ERROR: DynamoDb.get' });
      }
    });
  });
};

export const get = async (params: DocumentClient.GetItemInput, filter = null): Promise<DocumentClient.GetItemOutput> => {
  return new Promise((resolve, reject) => {
    try {
      dynamoDb.get(params, (error, result) => {
        console.log('dynamoDb.get', { error, result });
        if (error) {
          return reject({ message: 'ERROR: DynamoDB.get', error });
        }
        if (!result) {
          return reject({ message: 'ERROR: DynamoDB.get empty' });
        }
        console.log('SUCCESS: DynamoDB.batchGet: ', result);
        return resolve(result);
      });
    } catch (error) {
      return reject({ message: 'ERROR: DynamoDB.batchGet', error });
    }
  });
};

export const batchGetFilter = async (params: DocumentClient.BatchGetItemInput, filter): Promise<any> => {
  try {
    const response = await batchGet(params);
    console.log('batchGetFilter', response);

  } catch (error) {
    console.log('batchGetFilter ERROR:', error);
    throw new Error(error);
  }
};

export const batchGet = async (params: DocumentClient.BatchGetItemInput): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {

      dynamoDb.batchGet(params, (error, result) => {
        // handle potential errors
        if (error) {
          return reject({ message: 'ERROR: DynamoDB.batchGet', error });
        }
        if (!result) {
          return reject({ message: 'ERROR: DynamoDB.batchGet empty' });
        }
        // create a response
        console.log('SUCCESS: DynamoDB.batchGet: ', result);
        return resolve(result.Responses);
      });
    } catch (error) {
      return reject({ message: 'ERROR: DynamoDB.batchGet', error });
    }
  });
};

export const batchUpsert = async (
  data: DocumentClient.ItemList,
  table: DocumentClient.TableName
): Promise<any[]> => {
  const params: OnlyTableName = {
    TableName: table,
  };
  return await putBatchData(data, params);
};

const putBatchData = async (
  data: DocumentClient.ItemList,
  params: OnlyTableName,
): Promise<any[]> => {
  const log = [];
  await data.reduce(async (acc, item) => {
    const myparams: DocumentClient.PutItemInput = {
      ...params,
      Item: item,
    };
    try {
      await upsert(myparams);
      log.push({ success: item.name });
    } catch (error) {
      log.push({ failed: item.name });
    }
  }, []);
  return log;
};

export const updateBatchData = async (
  data: DocumentClient.ItemList,
  params: DocumentClient.UpdateItemInput,
  key: string
): Promise<any[]> => {
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
