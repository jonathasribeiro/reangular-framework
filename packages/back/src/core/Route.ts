import { registerController } from "./RouteController";

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

interface RouteEntry {
  method: HttpMethod;
  path: string;
  handler: string;
}

const routes: RouteEntry[] = [];
let currentPrefix = ""; // ✅ variável interna, fora do objeto Route

const Route = {
  get(path: string, handler: string) {
    routes.push({ method: "get", path: currentPrefix + path, handler });
  },

  post(path: string, handler: string) {
    routes.push({ method: "post", path: currentPrefix + path, handler });
  },

  put(path: string, handler: string) {
    routes.push({ method: "put", path: currentPrefix + path, handler });
  },

  delete(path: string, handler: string) {
    routes.push({ method: "delete", path: currentPrefix + path, handler });
  },

  patch(path: string, handler: string) {
    routes.push({ method: "patch", path: currentPrefix + path, handler });
  },

  all() {
    return routes;
  },

  clear() {
    routes.length = 0;
  },

  async controller(controllerPath: string, options?: { baseDir?: string }) {
    await registerController(controllerPath, "", options); // << usar prefixo vazio!
  },

  async group(prefix: string, callback: () => void | Promise<void>) {
    const previousPrefix = currentPrefix;
    currentPrefix = currentPrefix + prefix;
    await callback();
    currentPrefix = previousPrefix;
  },
};

export default Route;
