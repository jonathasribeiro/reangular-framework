import request from 'supertest';
import { createReangularServer } from './index';

describe('Reangular Backend', () => {
  it('should respond on GET /', async () => {
    const app = createReangularServer();
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('🧬 Reangular Backend is live!');
  });
});
