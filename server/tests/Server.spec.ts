import * as Koa from "koa";
import * as Router from "koa-router";
import * as serve from "koa-static";
import * as send from "koa-send";
import * as http2 from "http2";
import * as request from "supertest";
import Routes from "../Routes";
import Server, { ServerOptions } from "../Server";
import {
  validServerOptions,
  expectedSslOptions
} from "./fixtures/Server.fixtures";

describe("Testing Server.ts", () => {
  describe("Testing Server without options", () => {
    let server: Server;
    let mockedRoutesServe: jest.SpyInstance;
    let mockedRouterRoutes: jest.SpyInstance;
    let mockedRouterAllowedMethods: jest.SpyInstance;
    let mockedAppListen: jest.SpyInstance;

    beforeEach(() => {
      server = new Server();
      mockedRoutesServe = jest.spyOn(server.routes, "serve");
      mockedRouterRoutes = jest.spyOn(server.Router, "routes");
      mockedRouterAllowedMethods = jest.spyOn(server.Router, "allowedMethods");
      mockedAppListen = jest.spyOn(server.App, "listen");
    });
    test("should create a basic instance of Server with default values", () => {
      expect(server).toBeInstanceOf(Server);
      expect(server.App).toBeInstanceOf(Koa);
      expect(server.Router).toBeInstanceOf(Router);
      expect(server.routes).toBeInstanceOf(Routes);
      expect(server.Port).toBe(3000);
    });

    test("should throw error when invalid port provided:", () => {
      expect(() => {
        server.Port = -2;
      }).toThrow();
    });

    test("should set port when valid port provided:", () => {
      server.Port = 8080;
      expect(server.Port).toBe(8080);
    });

    test("public FolderServed should be undefined", () => {
      expect(server.publicFolderServed).toBe(undefined);
    });

    test("fallbackFile should be undefined", () => {
      expect(server.fallbackFile).toBe(undefined);
    });

    test("should startServer with correct values", () => {
      server.startServer();
      expect(mockedRoutesServe).toHaveBeenCalled();
      expect(mockedRouterRoutes).toHaveBeenCalled();
      expect(mockedRouterAllowedMethods).toHaveBeenCalled();
      expect(mockedAppListen).toHaveBeenCalledWith(server.Port);
      server.close();
    });

    test("should throw error if error ocurred when starting server:", () => {
      const error = jest.spyOn(global.console, "error");
      mockedRouterRoutes.mockImplementation(() => {
        throw "Error mocked";
      });

      server.startServer();

      expect(error).toHaveBeenCalled();

      server.close();
    });
  });

  describe("testing Server with Options:", () => {
    describe("testing valid Options", () => {
      test("should setDefault port if no port provided", () => {
        const options = { port: undefined };
        const server = new Server(options);

        expect(server.Port).toBe(3000);
      });

      test("should set port with value provided", () => {
        const options = { port: validServerOptions.port };
        const server = new Server(options);

        expect(server.Port).toBe(options.port);
      });

      test("should serve static folder when provided", () => {
        const options = {
          serveStaticFiles: {
            publicFolder: validServerOptions.serveStaticFiles.publicFolder
          }
        };
        const server = new Server(options);

        expect(server.publicFolderServed).toBe(
          options.serveStaticFiles.publicFolder
        );
        expect(serve).toHaveBeenCalledWith(
          options.serveStaticFiles.publicFolder
        );
      });

      describe("testing fallbackFiles", () => {
        let options: ServerOptions;
        let server: Server;
        beforeAll(() => {
          options = {
            serveStaticFiles: validServerOptions.serveStaticFiles
          };
          server = new Server(options);

          server.startServer();
        });

        afterAll(() => {
          server.close();
        });

        test("should serve fallbackFile when provided", async done => {
          expect(server.fallbackFile).toBe(options.serveStaticFiles.fallback);

          const response = await request(server.App.callback()).get(
            "/undefinedRoute"
          );

          expect(response.status).toBe(200);
          expect(response.get("Content-Type")).toContain("text/html");
          expect(send).toHaveBeenCalledWith(
            expect.any(Object),
            `/${options.serveStaticFiles.fallback}`,
            { root: options.serveStaticFiles.publicFolder }
          );

          done();
        });
      });

      describe("testing ssl Options:", () => {
        const options: ServerOptions = {
          port: 8080,
          serveStaticFiles: validServerOptions.serveStaticFiles,
          serveSSL: validServerOptions.serveSSL
        };
        let server: Server;
        let mockedSslServerListen: jest.SpyInstance;
        let mockedHttp2CreateSecureServer: jest.SpyInstance;

        beforeEach(() => {
          mockedHttp2CreateSecureServer = jest.spyOn(
            http2,
            "createSecureServer"
          );
          server = new Server(options);

          mockedSslServerListen = jest.spyOn(server.SslServer, "listen");
          server.startServer();
        });

        afterEach(() => {
          server.close();
        });

        test("should set ssl server when provided", () => {
          expect(mockedHttp2CreateSecureServer).toHaveBeenCalledWith(
            expectedSslOptions,
            expect.any(Function)
          );
        });

        test("ssl server should listen on provided port", () => {
          expect(mockedSslServerListen).toHaveBeenCalledWith(options.port);
        });
      });
    });

    describe("testing invalid options", () => {
      let options: ServerOptions;
      beforeEach(() => {
        options = Object.assign({}, validServerOptions);
      });

      test("should throw error when invalid public folder given", () => {
        let options: ServerOptions = {
          serveStaticFiles: {
            publicFolder: ""
          }
        };
        expect(() => {
          new Server(options);
        }).toThrow();
      });

      test("should throw error when invalid fallback file given", () => {
        let options: ServerOptions = {
          serveStaticFiles: {
            publicFolder: validServerOptions.serveStaticFiles.publicFolder,
            fallback: ""
          }
        };
        expect(() => {
          new Server(options);
        }).toThrow();
      });

      test("should throw error when invalid cer file provided", () => {
        let options: ServerOptions = {
          serveSSL: {
            certificatePath: "",
            keyPath: validServerOptions.serveSSL.keyPath
          }
        };
        expect(() => {
          new Server(options);
        }).toThrow();

        options.serveSSL.certificatePath = undefined;
        expect(() => {
          new Server(options);
        }).toThrow();
      });

      test("should throw error when invalid key file provided", () => {
        let options: ServerOptions = {
          serveSSL: {
            certificatePath: validServerOptions.serveSSL.certificatePath,
            keyPath: ""
          }
        };
        expect(() => {
          new Server(options);
        }).toThrow();

        options.serveSSL.keyPath = undefined;
        expect(() => {
          new Server(options);
        }).toThrow();
      });
    });

    describe("testing empty options provided", () => {
      let options = {
        port: undefined,
        serveGzip: undefined,
        serveStaticFiles: undefined,
        serveSSL: undefined
      };
      let server: Server;

      beforeEach(() => {
        server = new Server(options);
      });

      test("should create a basic server instance", () => {
        expect(server).toBeInstanceOf(Server);
        expect(server.App).toBeInstanceOf(Koa);
        expect(server.Router).toBeInstanceOf(Router);
        expect(server.routes).toBeInstanceOf(Routes);
        expect(server.Port).toBe(3000);
      });

      test("should start a basic server", () => {
        const mockedRoutesServe = jest.spyOn(server.routes, "serve");
        const mockedRouterRoutes = jest.spyOn(server.Router, "routes");
        const mockedRouterAllowedMethods = jest.spyOn(
          server.Router,
          "allowedMethods"
        );
        const mockedAppListen = jest.spyOn(server.App, "listen");

        server.startServer();
        expect(mockedRoutesServe).toHaveBeenCalled();
        expect(mockedRouterRoutes).toHaveBeenCalled();
        expect(mockedRouterAllowedMethods).toHaveBeenCalled();
        expect(mockedAppListen).toHaveBeenCalledWith(server.Port);
        server.close();
      });
    });

    test("should close appropriate server on server.close()", () => {
      const koaServer = new Server();
      koaServer.startServer();
      const mockedKoaServerClose = jest.spyOn(koaServer.KoaServer, "close");
      koaServer.close();

      expect(mockedKoaServerClose).toHaveBeenCalled;

      const sslServer = new Server(validServerOptions);
      const mockedSslServer = jest.spyOn(sslServer.SslServer, "close");
      sslServer.startServer();
      sslServer.close();

      expect(mockedSslServer).toHaveBeenCalled();
    });
  });
});
