import { NextFunction, Response } from 'express';
import { HttpResponse } from 'aws-sdk';
import { ERRORS } from '../../domain';

export const errorHandler = (error: HttpResponse, res: Response, next: NextFunction) => {
  console.error(error.body);
  // Not to return the detailed internal servers to consumers
  error.body = error.statusCode === 500 ? ERRORS.INTERNAL_SERVER_ERROR : error.body;
  res.status(error.statusCode).send(error);
  next();
};
