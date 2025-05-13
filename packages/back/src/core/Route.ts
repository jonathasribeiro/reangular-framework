type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: string; // Ex: 'UserController.index'
}

const routes: RouteDefinition[] = [];

const Route = {
  get(path: string, handler: string) {
    routes.push({ method: 'get', path, handler });
  },
  post(path: string, handler: string) {
    routes.push({ method: 'post', path, handler });
  },
  put(path: string, handler: string) {
    routes.push({ method: 'put', path, handler });
  },
  delete(path: string, handler: string) {
    routes.push({ method: 'delete', path, handler });
  },
  patch(path: string, handler: string) {
    routes.push({ method: 'patch', path, handler });
  },
  all() {
    return routes;
  },
  clear() {
    routes.length = 0;
  }
};

export default Route;
