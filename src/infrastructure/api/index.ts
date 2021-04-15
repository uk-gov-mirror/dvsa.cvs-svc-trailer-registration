import express from 'express';
import { router } from '../../interfaces/routes';
import { Configurations } from '../../interfaces/middlewares/configuration';

const app = express();

// initialize configurations;
Configurations.getInstance();
// Defining template routes, anything before /cvs-svc-template is proxied
app.use(`/*/${Configurations.getInstance().service}/`, router);

export { app };
