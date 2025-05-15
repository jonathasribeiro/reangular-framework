import path from 'path';
import Route from './Route';
import { registerController } from './RouteController';

describe('registerController', () => {
  beforeEach(() => {
    Route.clear();
  });

  it('should register decorated routes from controller', async () => {
    await registerController('TestRouteController', '', {
      baseDir: path.resolve(__dirname, '../__mocks__/controllers')
    });

    const routes = Route.all();

    expect(routes).toEqual([
      { method: 'get', path: '/mock', handler: 'TestController.index' },
      { method: 'post', path: '/mock', handler: 'TestController.store' }
    ]);
  });

  it('should apply group prefix if provided', async () => {
    await registerController('TestRouteController', '/admin', {
      baseDir: path.resolve(__dirname, '../__mocks__/controllers')
    });

    const routes = Route.all();

    expect(routes).toEqual([
      { method: 'get', path: '/admin/mock', handler: 'TestController.index' },
      { method: 'post', path: '/admin/mock', handler: 'TestController.store' }
    ]);
  });
});

describe('Route.group', () => {
  beforeEach(() => {
    Route.clear();
  });

  it('should apply group prefix to controller routes', async () => {
  await Route.group('/api', async () => {
    await Route.controller('TestRouteController', {
      baseDir: path.resolve(__dirname, '../__mocks__/controllers')
    });
  });

  const routes = Route.all();

  expect(routes).toEqual([
    { method: 'get', path: '/api/mock', handler: 'TestController.index' },
    { method: 'post', path: '/api/mock', handler: 'TestController.store' }
  ]);
});
});
