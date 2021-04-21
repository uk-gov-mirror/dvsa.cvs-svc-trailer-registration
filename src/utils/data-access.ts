import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import DynamoDB, { DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { Configurations } from './configuration';
import * as domain from '../domain';

export class DataAccess {
  private static instance: DataAccess;

  private readonly tableName: string;

  private static docClient: DocumentClient;

  private constructor() {
    this.tableName = Configurations.getInstance().dynamoTableName;
    DataAccess.docClient = new DynamoDB.DocumentClient(Configurations.getInstance().dynamoParams);
  }

  public static getInstance(): DataAccess {
    if (!DataAccess.instance) {
      DataAccess.instance = new DataAccess();
    }

    return DataAccess.instance;
  }

  public getById(options: {
    indexName: string;
    keyCondition: string;
    expressionAttributeValues: { [key: string]: string };
  }): Promise<PromiseResult<QueryOutput, AWSError>> {
    const params = {
      TableName: this.tableName,
      IndexName: options.indexName,
      KeyConditionExpression: options.keyCondition,
      ExpressionAttributeValues: options.expressionAttributeValues,
    };
    console.log('dynamo paramns', params);
    return DataAccess.docClient.query(params).promise();
  }

  public async put<T>(
    payload: T,
    options: { conditionalExpression: string; expressionAttributeValues: { [key: string]: string } },
  ): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
    const query = {
      TableName: this.tableName,
      Item: payload,
      ConditionExpression: options.conditionalExpression,
      ExpressionAttributeValues: options.expressionAttributeValues,
    };
    return DataAccess.docClient.put(query).promise();
  }

  public async insertTrailerRegisteration(
    trailerRegistration: domain.TrailerRegistration,
  ): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
    const insertParams = {
      conditionalExpression: 'vinOrChassisWithMake <> :vinOrChassisWithMake',
      expressionAttributeValues: { ':vinOrChassisWithMake': trailerRegistration.vinOrChassisWithMake },
    };
    return DataAccess.getInstance().put<domain.TrailerRegistration>(trailerRegistration, insertParams);
  }

  public async getByVinOrChassisWithMake(vinOrChassisWithMake: string): Promise<domain.TrailerRegistration[]> {
    const getParams = {
      indexName: 'vinOrChassisWithMakeIndex',
      keyCondition: 'vinOrChassisWithMake = :vinOrChassisWithMake',
      expressionAttributeValues: {
        ':vinOrChassisWithMake': vinOrChassisWithMake,
      },
    };
    const data = (await DataAccess.getInstance().getById(getParams)) as { Count: number; Items: unknown };
    if (!data || !data.Count) {
      return null;
    }
    return data.Items as domain.TrailerRegistration[];
  }

  public async deregisterTrailer(
    updatedTrailerRegistration: domain.TrailerRegistration,
  ): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
    const { vinOrChassisWithMake } = updatedTrailerRegistration;
    return DataAccess.getInstance().put<domain.TrailerRegistration>(updatedTrailerRegistration, {
      conditionalExpression: 'vinOrChassisWithMake = :vinOrChassisWithMake',
      expressionAttributeValues: { ':vinOrChassisWithMake': vinOrChassisWithMake },
    });
  }
}
