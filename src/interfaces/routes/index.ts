/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import * as controller from '../controllers';

export const router = Router();

router.post('/', (req, res, next) => new controller.InsertTrailerRegistration().call(req, res, next));
