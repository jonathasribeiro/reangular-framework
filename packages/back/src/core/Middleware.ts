export type MiddlewareFn = (req: any, res: any, next: () => void) => void;

const globalMiddlewares: MiddlewareFn[] = [];
const namedMiddlewares: Record<string, MiddlewareFn> = {};

const Middleware = {
  useGlobal(mw: MiddlewareFn) {
    globalMiddlewares.push(mw);
  },
  register(name: string, fn: MiddlewareFn) {
    namedMiddlewares[name] = fn;
  },
  getGlobal() {
    return globalMiddlewares;
  },
  resolve(names: string[]): MiddlewareFn[] {
    return names.map(n => namedMiddlewares[n]).filter(Boolean);
  }
};

export default Middleware;