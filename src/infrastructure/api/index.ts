import express from 'express';
import { router } from '../../interfaces/routes';

const app = express();

const { SERVICE } = process.env;

// Defining template routes, anything before /cvs-svc-template is proxied
app.use(`/*/${SERVICE}/`, router);

export { app };
