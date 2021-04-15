import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import { DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { Configurations } from '../interfaces/middlewares/configuration';

export class DataAccess {
  private static instance: DataAccess;

  private readonly tableName: string;

  private static docClient: DocumentClient;

  private constructor() {
    this.tableName = Configurations.getInstance().dynamoTableName;
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
    expressionAttirbute: { [key: string]: string };
    expressionAttributeValues: { [key: string]: string };
  }): Promise<PromiseResult<QueryOutput, AWSError>> {
    const params = {
      TableName: this.tableName,
      IndexName: options.indexName,
      KeyConditionExpression: options.keyCondition,
      ExpressionAttributeNames: options.expressionAttirbute,
      ExpressionAttributeValues: options.expressionAttributeValues,
    };
    return DataAccess.docClient.query(params).promise();
  }

  public async createSingle<T>(
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
}
