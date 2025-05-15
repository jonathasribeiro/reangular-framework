import path from "path";
import fs from "fs";
import Route from "./Route";
import { getControllerRoutes } from "./decorators";

type RegisterOptions = {
  baseDir?: string; // opcional, padrão é 'src/controllers'
};

/**
 * Registra rotas automaticamente com base nos decorators do controller.
 *
 * @param controllerPath Ex: 'UserController' ou 'Admin/UserController'
 * @param groupPrefix Prefixo opcional (usado por Route.group)
 * @param options Configurações adicionais (como baseDir)
 */
export async function registerController(
  controllerPath: string,
  groupPrefix: string = "",
  options: RegisterOptions = {}
) {
  const defaultBaseDir = options.baseDir
    ? path.resolve(process.cwd(), options.baseDir)
    : path.resolve(process.cwd(), "src/controllers");

  const guessedPath =
    controllerPath.endsWith(".ts") || controllerPath.endsWith(".js")
      ? path.resolve(process.cwd(), controllerPath)
      : path.resolve(defaultBaseDir, `${controllerPath}.ts`);

  const jsFallbackPath = guessedPath.replace(/\.ts$/, ".js");

  const resolvedPath = fs.existsSync(guessedPath)
    ? guessedPath
    : fs.existsSync(jsFallbackPath)
    ? jsFallbackPath
    : "";

  if (!resolvedPath || !fs.existsSync(resolvedPath)) {
    console.warn(`⚠️ Controller not found: ${resolvedPath || guessedPath}`);
    return;
  }

  const controllerModule = await import(resolvedPath);
  const Controller = controllerModule.default || controllerModule;
  const controller = new Controller();

  const routes = getControllerRoutes(Controller);
  const controllerName = Controller.name;

  for (const { method, path: routePath } of routes) {
    const fullRoute = groupPrefix + routePath;
    Route[method](
      fullRoute,
      `${controllerName}.${getMethodName(controller, method, routePath)}`
    );
  }
}

/**
 * Retorna o nome do método dentro da classe com base no metadata, ou tenta inferir.
 */
function getMethodName(
  controllerInstance: any,
  method: string,
  routePath: string
): string {
  const proto = Object.getPrototypeOf(controllerInstance);
  const keys = Object.getOwnPropertyNames(proto);

  for (const key of keys) {
    const meta = Reflect.getMetadata(
      `reangular:handler:${key}`,
      controllerInstance.constructor
    );
    if (meta === `${method.toUpperCase()} ${routePath}`) {
      return key;
    }
  }

  return "index"; // fallback
}
