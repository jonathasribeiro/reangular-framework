import { Request, Response } from 'express';
import { Get, Post } from '../../core/decorators';

export default class TestController {
  @Get('/mock')
  index(req: Request, res: Response) {
    res.send('GET');
  }

  @Post('/mock')
  store(req: Request, res: Response) {
    res.send('POST');
  }
}
