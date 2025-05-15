import Route from "./Route";

describe("Route Core", () => {
  beforeEach(() => {
    Route.clear();
  });

  it("should register GET route", () => {
    Route.get("/users", "UserController.index");

    const all = Route.all();
    expect(all).toHaveLength(1);
    expect(all[0]).toEqual({
      method: "get",
      path: "/users",
      handler: "UserController.index",
      middlewares: [],
    });
  });
});
