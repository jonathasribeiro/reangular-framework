import express, { Request, Response } from 'express';

export const createReangularServer = () => {
  const app = express();

  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.send('🧬 Reangular Backend is live!');
  });

  return app;
};
