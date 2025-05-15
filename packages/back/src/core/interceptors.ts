export interface Interceptor {
  intercept(req: any, res: any, next: () => void): void;
}

const interceptorRegistry: any[] = [];

export function UseInterceptor(interceptor: new () => Interceptor): MethodDecorator {
  return (target, key) => {
    Reflect.defineMetadata(`reangular:interceptor:${String(key)}`, new interceptor(), target.constructor);
  };
}

export function getInterceptorFor(target: any, key: string): Interceptor | null {
  return Reflect.getMetadata(`reangular:interceptor:${key}`, target.constructor) || null;
}