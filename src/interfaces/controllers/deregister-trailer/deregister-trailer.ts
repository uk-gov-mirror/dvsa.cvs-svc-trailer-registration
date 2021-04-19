import { Request, Response, NextFunction } from 'express';
import * as domain from '../../../domain';
import { IRequestHandler } from '../i-request-handler';

export class DeregisterTrailer implements IRequestHandler<domain.TrailerRegistration> {
  validate(payload?: domain.TrailerRegistration): boolean {
    console.log(payload);
    throw new Error('Method not implemented.');
  }

  call(req: Request, res: Response, next: NextFunction) {
    console.log(req, res);
    throw new Error('Method not implemented.');
    next();
  }
}
