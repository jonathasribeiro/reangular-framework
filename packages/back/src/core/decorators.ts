import 'reflect-metadata';
import { MiddlewareFn } from './Middleware';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface RouteMeta {
  method: HttpMethod;
  path: string;
}

export const createMethodDecorator = (method: HttpMethod) => {
  return (path: string): MethodDecorator => {
    return (
      target: Object,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      const existingRoutes: RouteMeta[] =
        Reflect.getMetadata('reangular:routes', target.constructor) || [];

      existingRoutes.push({ method, path });

      Reflect.defineMetadata('reangular:routes', existingRoutes, target.constructor);
      Reflect.defineMetadata(
        `reangular:handler:${String(propertyKey)}`,
        `${method.toUpperCase()} ${path}`,
        target.constructor
      );
    };
  };
};

export const Get = createMethodDecorator('get');
export const Post = createMethodDecorator('post');
export const Put = createMethodDecorator('put');
export const Delete = createMethodDecorator('delete');
export const Patch = createMethodDecorator('patch');

export function getControllerRoutes(controller: any): RouteMeta[] {
  return Reflect.getMetadata('reangular:routes', controller) || [];
}

export function Middleware(name: string): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(`reangular:middleware:${String(propertyKey)}`, name, target.constructor);
  };
}
