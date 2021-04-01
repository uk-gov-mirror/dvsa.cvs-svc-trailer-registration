import express from 'express';

const app = express();

const router = express.Router();

const { API_VERSION, SERVICE } = process.env;

console.log({ SERVICE });
console.log({ API_VERSION });
/**
 * Define routing and route level middleware if necessary from ./routes
 * (POST) http://localhost:3009/<stage>/                                  (configured on AWS)
 *                                      <**>/<*>/trailers /               (configured/proxied from app)
 */
router.post('/', (_, res, next) => {
  res.send('ok template route');
  next();
});

// Defining template routes, anything before /trailers is proxied
app.use('/*/trailers/', router);

/**
 * Debug router before we start proxying
 */
app.get('/version', (_, res) => {
  res.send({ version: API_VERSION });
});

// Serverless lambda invocation debug route - local/database/base-path.json
app.get('/', (_, res) => {
  res.send({ ok: true });
});

export { app };
