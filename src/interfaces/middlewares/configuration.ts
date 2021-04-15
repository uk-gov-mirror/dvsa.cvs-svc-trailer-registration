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

  get dynamoTableName(): string {
    return process.env.DYNAMO_TABLE_NAME;
  }

  get service(): string {
    return process.env.SERVICE;
  }
}
