import express from 'express';

export const router = express.Router();

router.post('/', (_, res, next) => {
  res.send('ok template route');
  next();
});

router.put('/deregister/:trn', (_, res, next) => {
  res.send('ok template route');
  next();
});
