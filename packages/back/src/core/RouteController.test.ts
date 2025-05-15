import path from "path";
import Route from "./Route";
import { registerController } from "./RouteController";

describe("registerController", () => {
  beforeEach(() => {
    Route.clear();
  });

  it("should register decorated routes from controller", async () => {
    await registerController("TestRouteController", "", {
      baseDir: path.resolve(__dirname, "../__mocks__/controllers"),
    });

    const routes = Route.all();

    expect(routes).toEqual([
      {
        method: "get",
        path: "/mock",
        handler: "TestRouteController.index",
        middlewares: [],
      },
      {
        method: "post",
        path: "/mock",
        handler: "TestRouteController.store",
        middlewares: [],
      },
    ]);
  });

  it("should apply group prefix if provided", async () => {
    await registerController("TestRouteController", "/admin", {
      baseDir: path.resolve(__dirname, "../__mocks__/controllers"),
    });

    const routes = Route.all();

    expect(routes).toEqual([
      {
        method: "get",
        path: "/admin/mock",
        handler: "TestRouteController.index",
        middlewares: [],
      },
      {
        method: "post",
        path: "/admin/mock",
        handler: "TestRouteController.store",
        middlewares: [],
      },
    ]);
  });
});

describe("Route.group", () => {
  beforeEach(() => {
    Route.clear();
  });

  it("should apply group prefix to controller routes", async () => {
    Route.group("/api", async () => {
      Route.controller("TestRouteController", {
        baseDir: "src/__mocks__/controllers",
      });
    });

    const routes = Route.all();

    expect(routes).toEqual([
      {
        method: "get",
        path: "/api/mock",
        handler: "TestRouteController.index",
        middlewares: [],
      },
      {
        method: "post",
        path: "/api/mock",
        handler: "TestRouteController.store",
        middlewares: [],
      },
    ]);
  });
});
