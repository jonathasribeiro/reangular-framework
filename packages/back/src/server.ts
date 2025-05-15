import 'reflect-metadata';
import express from "express";
import Route from "./core/Route";
import path from "path";
import { loadRoutes } from "./loader/loadRoutes";
import fs from "fs";

export const createReangularServer = async (
  appRoot: string = process.cwd()
) => {
  const app = express();
  app.use(express.json());

  await loadRoutes(appRoot);

  console.log("[DEBUG] Registered routes:", Route.all());

  for (const route of Route.all()) {
    const [controllerName, methodName] = route.handler.split(".");
    let controllerPath = path.join(
      appRoot,
      "controllers",
      `${controllerName}.ts`
    );
    if (!fs.existsSync(controllerPath)) {
      controllerPath = path.join(
        appRoot,
        "controllers",
        `${controllerName}.js`
      );
    }

    const controllerModule = await import(controllerPath);
    const Controller = controllerModule.default || controllerModule;
    const controller = new Controller();

    app[route.method](route.path, controller[methodName].bind(controller));
  }

  return app;
};
