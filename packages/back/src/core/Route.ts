import Middleware, { MiddlewareFn } from "./Middleware";
import { registerController } from "./RouteController";

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

interface RouteEntry {
  method: HttpMethod;
  path: string;
  handler: string;
  middlewares?: MiddlewareFn[];
}

const routes: RouteEntry[] = [];
let currentPrefix = "";
let tempMiddlewares: string[] = [];

const Route = {
  middleware(names: string[]) {
    tempMiddlewares = names;
    return Route;
  },

  get(path: string, handler: string) {
    routes.push({
      method: "get",
      path: currentPrefix + path,
      handler,
      middlewares: Middleware.resolve(tempMiddlewares),
    });
    tempMiddlewares = [];
  },

  post(path: string, handler: string) {
    routes.push({
      method: "post",
      path: currentPrefix + path,
      handler,
      middlewares: Middleware.resolve(tempMiddlewares),
    });
    tempMiddlewares = [];
  },

  put(path: string, handler: string) {
    routes.push({
      method: "put",
      path: currentPrefix + path,
      handler,
      middlewares: Middleware.resolve(tempMiddlewares),
    });
    tempMiddlewares = [];
  },

  delete(path: string, handler: string) {
    routes.push({
      method: "delete",
      path: currentPrefix + path,
      handler,
      middlewares: Middleware.resolve(tempMiddlewares),
    });
    tempMiddlewares = [];
  },

  patch(path: string, handler: string) {
    routes.push({
      method: "patch",
      path: currentPrefix + path,
      handler,
      middlewares: Middleware.resolve(tempMiddlewares),
    });
    tempMiddlewares = [];
  },

  all() {
    return routes;
  },

  clear() {
    routes.length = 0;
    tempMiddlewares = [];
    currentPrefix = "";
  },

  async controller(controllerPath: string, options?: { baseDir?: string }) {
    await registerController(controllerPath, "", options);
  },

  group(prefix: string, callback: () => void | Promise<void>) {
    const previous = currentPrefix;
    currentPrefix = currentPrefix + prefix;

    const result = callback();
    if (result instanceof Promise) {
      return result.finally(() => {
        currentPrefix = previous;
      });
    }

    currentPrefix = previous;
  },
};

export default Route;
