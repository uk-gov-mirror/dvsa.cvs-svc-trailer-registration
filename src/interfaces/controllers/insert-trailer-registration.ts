import { HttpResponse } from 'aws-sdk';
import { TrailerRegistration } from '../../domain/trailer-registration';
import { ResponseHandler } from '../../utils/response-handler';
import { DataAccess } from '../../utils/data-access';

export class InsertTrailerRegistration {
  public async createTrailer(trailerRegistration: TrailerRegistration): Promise<HttpResponse> {
    const { vin, make } = trailerRegistration;
    const vinOrChassisWithMake = vin.length === 17 ? vin : vin + make;

    try {
      const existingTrailerRegistration = await this.checkForExistingTrailerRegisteration(vinOrChassisWithMake);
      // TODO: if exists then deregister the existing certificate
      if (existingTrailerRegistration) {
        this.deregisterTrailer(existingTrailerRegistration);
      }
    } catch (error) {
      console.error(error);
      ResponseHandler.failure(500, 'Internal Server Error');
    }

    // TODO: create new trailer registration

    return ResponseHandler.success();
  }

  private async checkForExistingTrailerRegisteration(
    vinOrChassisWithMake: string,
  ): Promise<TrailerRegistration | null> {
    // TODO: get data based on vinOrChassisWithMake
    const data = (await DataAccess.getInstance().getById({
      indexName: 'vinOrChassisWithMakeIndex',
      keyCondition: '#vinOrChassisWithMake = :vinOrChassisWithMake',
      expressionAttirbute: {
        '#vinOrChassisWithMake': 'vinOrChassisWithMake',
      },
      expressionAttributeValues: {
        ':vinOrChassisWithMake': vinOrChassisWithMake,
      },
    })) as { Count: number; Items: any };
    if (!data.Count) {
      return null;
    }
    const trailerRegistration = data.Items as TrailerRegistration[];
    if (trailerRegistration.length === 1) {
      return trailerRegistration[0];
    }
    throw new Error('Multiple registrations found');
  }

  private deregisterTrailer(trailerRegistration: TrailerRegistration) {
    // TODO: deregister existing trailer registration
  }
}
