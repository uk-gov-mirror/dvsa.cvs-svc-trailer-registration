import * as dotenv from 'dotenv';

export class Configurations {
  private static instance: Configurations;

  private constructor() {
    dotenv.config();
  }

  public static getInstance(): Configurations {
    if (!Configurations.instance) {
      Configurations.instance = new Configurations();
    }

    return Configurations.instance;
  }

  get awsProfile(): string {
    return process.env.AWS_PROVIDER_PROFILE;
  }

  get awsRegion(): string {
    return process.env.AWS_PROVIDER_REGION;
  }

  get awsStage(): string {
    return process.env.AWS_PROVIDER_STAGE;
  }

  get service(): string {
    return process.env.SERVICE;
  }

  get dynamoTableName(): string {
    return process.env.DYNAMO_TABLE_NAME;
  }

  get dynamoParams(): unknown {
    return {
      region: this.awsRegion,
      endpoint: process.env.DYNAMO_ENDPOINT,
      convertEmptyValues: process.env.CONVERT_EMPTY_VALUES,
    };
  }
}
