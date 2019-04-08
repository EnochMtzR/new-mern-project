import Routes from "../Routes";
import * as Koa from "koa";
import * as Router from "koa-router";
import { testRoute } from "./fixtures/Routes.fixtures";

describe("Testing Routes.ts", () => {
  const app = new Koa();
  const router = new Router();
  let instance: Routes;
  let routes: ((router: Router) => void)[];

  describe("testing with all parameters as expected", () => {
    beforeEach(() => {
      instance = new Routes(app, router);
      routes = instance.add(testRoute);
    });

    test("should add route function to array", () => {
      expect(instance).toBeInstanceOf(Routes);
      expect(routes.length).toBe(1);
      expect(routes[0]).toEqual(testRoute);
    });

    test("should run each route function in array", () => {
      instance.serve();
      expect(testRoute).toHaveBeenCalledWith(router);
    });
  });

  describe("testing with no arguments", () => {
    const warning = jest.spyOn(global.console, "warn");

    test("should throw error when no app and router provided:", () => {
      expect(Routes).toThrow();
    });

    test("should return warning when no routes have been added", () => {
      const instance = new Routes(app, router);
      instance.serve();
      expect(warning).toHaveBeenCalled();
    });
  });
});
