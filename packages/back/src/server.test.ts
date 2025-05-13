import request from 'supertest';
import path from 'path';
import { createReangularServer } from './server';
import Route from './core/Route';

describe('createReangularServer', () => {
  const mockRoot = path.join(__dirname, '__mocks__');

  it('should respond to registered route from controller', async () => {
    Route.clear(); // Garante um estado limpo
    const app = await createReangularServer(mockRoot);

    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
    expect(res.text).toBe('ok');
  });
});
