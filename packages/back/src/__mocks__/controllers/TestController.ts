import { Request, Response } from 'express';

export default class {
  index(req: Request, res: Response) {
    res.send('ok');
  }
}
