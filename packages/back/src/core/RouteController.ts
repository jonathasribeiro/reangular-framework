import path from "path";
import fs from "fs";
import Route from "./Route";
import { getControllerRoutes } from "./decorators";

type RegisterOptions = {
  baseDir?: string; // opcional, padrão é 'src/controllers'
};

/**
 * Registra rotas com base nos decorators, sem importar o controller.
 * Apenas define as rotas e os handlers com base no nome do arquivo e decorators.
 */
export function registerController(
  controllerPath: string,
  groupPrefix: string = "",
  options: RegisterOptions = {}
) {
  const defaultBaseDir = options.baseDir
    ? path.resolve(process.cwd(), options.baseDir)
    : path.resolve(process.cwd(), "src/controllers");

  const filePath =
    controllerPath.endsWith(".ts") || controllerPath.endsWith(".js")
      ? path.resolve(process.cwd(), controllerPath)
      : path.resolve(defaultBaseDir, `${controllerPath}.ts`);

  const jsFallbackPath = filePath.replace(/\.ts$/, ".js");

  const resolvedPath = fs.existsSync(filePath)
    ? filePath
    : fs.existsSync(jsFallbackPath)
    ? jsFallbackPath
    : "";

  if (!resolvedPath || !fs.existsSync(resolvedPath)) {
    console.warn(`⚠️ Controller not found: ${resolvedPath || filePath}`);
    return;
  }

  const ControllerName = path.basename(controllerPath); // Ex: "UserController"
  const exportedClass = require(resolvedPath); // ✅ require síncrono
  const Controller = exportedClass.default || exportedClass;

  const routes = getControllerRoutes(Controller);

  for (const { method, path: routePath } of routes) {
    const handlerKey = getMethodNameFromMeta(Controller, method, routePath);
    Route[method](groupPrefix + routePath, `${ControllerName}.${handlerKey}`);
  }
}

/**
 * Retorna o nome do método com base no metadata (sem instanciar o controller).
 */
function getMethodNameFromMeta(
  controllerClass: any,
  method: string,
  routePath: string
): string {
  const proto = controllerClass.prototype;
  const keys = Object.getOwnPropertyNames(proto);

  for (const key of keys) {
    const meta = Reflect.getMetadata(
      `reangular:handler:${key}`,
      controllerClass
    );
    if (meta === `${method.toUpperCase()} ${routePath}`) {
      return key;
    }
  }

  return "index";
}
