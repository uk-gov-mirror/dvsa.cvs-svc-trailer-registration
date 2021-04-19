import { Request, Response, NextFunction } from 'express';

export interface IRequestHandler<T> {
  call(req: Request, res: Response, next: NextFunction);
  validate(payload?: T): boolean;
}
