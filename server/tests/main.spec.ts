import { config } from "../config/cfg";
import * as main from "../main";
import * as db from "../db/mongoose";
import Server from "../Server";

describe("Testing main.ts", () => {
  const mockedConnectDB = jest.spyOn(db, "connectDB");

  afterAll(() => {
    main.server.close();
  });

  test("should set server options from environment", () => {
    expect(main.options).toEqual(config.test.serverOptions);
  });

  test("should create a server", () => {
    expect(main.server).toBeInstanceOf(Server);
  });
});
