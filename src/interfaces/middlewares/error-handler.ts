import { NextFunction, Response, Request } from 'express';
import * as domain from '../../domain';

export const errorHandler = (err: domain.HTTPError, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = status === 500 ? domain.ERRORS.INTERNAL_SERVER_ERROR : err.body;
  res.status(status).send(message);
};
