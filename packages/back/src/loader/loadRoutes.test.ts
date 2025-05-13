import fs from 'fs';
import path from 'path';
import Route from '../core/Route';
import { loadRoutes } from './loadRoutes';

describe('loadRoutes', () => {
  const mockRoot = path.join(__dirname, '__mocks__');

  beforeAll(() => {
    if (!fs.existsSync(mockRoot)) fs.mkdirSync(mockRoot);
    fs.writeFileSync(
      path.join(mockRoot, 'routes.ts'),
      `
        import Route from '../../core/Route';
        Route.get('/mock', 'MockController.index');
      `
    );
  });

  afterAll(() => {
    fs.rmSync(mockRoot, { recursive: true, force: true });
  });

  it('should load routes from routes.ts file', async () => {
    await loadRoutes(mockRoot);

    const all = Route.all();
    expect(all).toHaveLength(1);
    expect(all[0].path).toBe('/mock');
  });
});
