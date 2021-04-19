import { Request, Response, NextFunction } from 'express';
import * as domain from '../../../domain';
import { ResponseHandler } from '../../../utils/response-handler';
import { DataAccess } from '../../../utils/data-access';
import { IRequestHandler } from '../i-request-handler';
import { insertValidator } from './insert-trailer-validator';

export class InsertTrailerRegistration implements IRequestHandler<domain.TrailerRegistration> {
  validate(payload?: domain.TrailerRegistration): boolean {
    const errors = insertValidator.validate(payload, { abortEarly: false }).error;
    if (errors) {
      throw new Error(errors.annotate());
    }
    return !errors;
  }

  public async call(req: Request, res: Response, next: NextFunction) {
    const trailerRegistration = req.body as domain.TrailerRegistration;
    console.info('inside insert-trailer');
    console.log(trailerRegistration);
    try {
      this.validate(trailerRegistration);
    } catch (err) {
      next(ResponseHandler.failure(400, err));
    }
    const { vin, make, certificateIssueDate } = trailerRegistration;
    const vinOrChassisWithMake = vin.length === 17 ? vin : vin + make;

    try {
      const existingTrailerRegistration = await this.checkForExistingTrailerRegistration(vinOrChassisWithMake);
      if (existingTrailerRegistration) {
        await this.deregisterTrailer(existingTrailerRegistration, certificateIssueDate);
      }
    } catch (error) {
      next(ResponseHandler.failure(500, error));
    }
    try {
      const insertParams = {
        conditionalExpression: 'vinOrChassisWithMake <> :vinOrChassisWithMake',
        expressionAttributeValues: { ':vinOrChassisWithMake': vinOrChassisWithMake },
      };
      trailerRegistration.vinOrChassisWithMake = vinOrChassisWithMake;
      await DataAccess.getInstance().put<domain.TrailerRegistration>(trailerRegistration, insertParams);
    } catch (error) {
      next(ResponseHandler.failure(500, error));
    }
    const response = ResponseHandler.success();
    res.status(response.statusCode).send(response.body);
  }

  private async checkForExistingTrailerRegistration(
    vinOrChassisWithMake: string,
  ): Promise<domain.TrailerRegistration | null> {
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
    const trailerRegistration = data.Items as domain.TrailerRegistration[];
    if (trailerRegistration.length === 1) {
      return trailerRegistration[0];
    }
    throw new Error('Multiple registrations found');
  }

  private async deregisterTrailer(
    trailerRegistration: domain.TrailerRegistration,
    deregisterDate: Date,
  ): Promise<void> {
    try {
      const { vinOrChassisWithMake } = trailerRegistration;
      const updatedTrailerRegistration = {
        ...trailerRegistration,
        reasonForDeregistration: domain.MESSAGES.NEW_CERTIFICATE_RECEIVED,
        deregisterDate,
      };
      await DataAccess.getInstance().put<domain.TrailerRegistration>(updatedTrailerRegistration, {
        conditionalExpression: 'vinOrChassisWithMake = :vinOrChassisWithMake',
        expressionAttributeValues: { ':vinOrChassisWithMake': vinOrChassisWithMake },
      });
    } catch (err) {
      console.error('error on deregister during insert', err);
      throw err;
    }
  }
}
