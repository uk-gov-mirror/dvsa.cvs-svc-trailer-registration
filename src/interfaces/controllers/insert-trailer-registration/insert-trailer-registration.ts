import { Request, Response, NextFunction } from 'express';
import * as domain from '../../../domain';
import { DataAccess } from '../../../utils/data-access';
import { IRequestHandler } from '../i-request-handler';
import { insertValidator } from './insert-trailer-validator';

export class InsertTrailerRegistration implements IRequestHandler {
  private validate(payload?: domain.TrailerRegistration): string {
    const errors = insertValidator.validate(payload, { abortEarly: false }).error;
    return errors?.message;
  }

  public async call(req: Request, res: Response, next: NextFunction) {
    const trailerRegistration = req.body as domain.TrailerRegistration;
    // TODO: remove once development is done
    console.log(trailerRegistration);
    const errors = this.validate(trailerRegistration);
    if (errors) {
      next(new domain.HTTPError(400, errors));
      return;
    }

    const { vin, make, certificateIssueDate } = trailerRegistration;
    const vinOrChassisWithMake = vin.length === 17 ? vin : vin + make;

    try {
      const existingTrailerRegistration = await this.checkForExistingTrailerRegistration(vinOrChassisWithMake);
      if (existingTrailerRegistration) {
        await this.deregisterTrailer(existingTrailerRegistration, certificateIssueDate);
      }
    } catch (error) {
      console.error(error);
      next(new domain.HTTPError(500, error));
      return;
    }
    try {
      trailerRegistration.vinOrChassisWithMake = vinOrChassisWithMake;
      await DataAccess.getInstance().insertTrailerRegisteration(trailerRegistration);
    } catch (error) {
      next(new domain.HTTPError(500, error));
      return;
    }
    res.status(204).send();
  }

  private async checkForExistingTrailerRegistration(
    vinOrChassisWithMake: string,
  ): Promise<domain.TrailerRegistration | null> {
    const trailerRegistration = await DataAccess.getInstance().getByVinOrChassisWithMake(vinOrChassisWithMake);
    if (!trailerRegistration) {
      return null;
    }
    if (trailerRegistration.length === 1) {
      return trailerRegistration[0];
    }

    throw new domain.HTTPError(500, domain.ERRORS.MULTIPLE_REGISTRATIONS);
  }

  private async deregisterTrailer(
    trailerRegistration: domain.TrailerRegistration,
    deregisterDate: Date,
  ): Promise<void> {
    try {
      const updatedTrailerRegistration = {
        ...trailerRegistration,
        reasonForDeregistration: domain.MESSAGES.NEW_CERTIFICATE_RECEIVED,
        deregisterDate,
      };
      await DataAccess.getInstance().deregisterTrailer(updatedTrailerRegistration);
    } catch (err) {
      console.error('error on deregister during insert', err);
      throw err;
    }
  }
}
