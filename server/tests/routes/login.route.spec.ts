import * as mongoose from "mongoose";
import * as jwt from "jsonwebtoken";
import * as request from "supertest";
import "../../config/config";
import * as db from "../../db/mongoose";
import User, { IUser } from "../../models/user";
import * as routesFixture from "../fixtures/Routes.fixtures";
import * as login from "../../routes/login.route";
import * as service from "../../main";

db.connectDB();

let expectedUser: IUser;

describe("testing login.route.ts", () => {
  beforeEach(async () => {
    mongoose.connection.dropCollection("users");
    const user = new User(routesFixture.testUser);
    expectedUser = (await user.save()).toObject();
  });

  afterAll(() => {
    service.server.close();
  });

  describe("testing getUser(userName, password)", () => {
    test("should return the expected user when correct login credentials provided", async () => {
      const foundUser = await login.getUser(expectedUser.name, "testPassword");

      expect(foundUser).toEqual(expectedUser);
    });

    test("should return null when incorrect user provided ", async () => {
      const foundUser = await login.getUser("t", "t");
      expect(foundUser).toBeNull();
    });

    test("should return null when incorrect password provided", async () => {
      const foundUser = await login.getUser(
        expectedUser.name,
        "Wrong Password"
      );

      expect(foundUser).toBeNull();
    });
  });

  describe("testing getJWT(user)", () => {
    test("should return web token when called", () => {
      const WebToken = login.getJWT(expectedUser);
      expect(WebToken.length).not.toBe(0);
      expect(jwt.verify(WebToken, process.env.JWT_SECRET)).not.toBeNull();
    });
  });

  describe("testing loginUser(user, token)", () => {
    test("should return user with valid token and lastLogin", async () => {
      const webToken = login.getJWT(expectedUser);
      const loggedUser = await login.loginUser(expectedUser, webToken);

      expect(loggedUser.login.lastLogin).not.toBe(0);
      expect(loggedUser.login.token).not.toBeNull();
      expect(
        jwt.verify(loggedUser.login.token, process.env.JWT_SECRET)
      ).not.toBeNull();
    });
  });

  describe("Integration test of route POST /login", () => {
    test("should login when valid credentials provided", async () => {
      const response = await request(service.server.App.callback())
        .post("/login")
        .send(routesFixture.validLogin);

      expect(response.status).toBe(200);
      expect(response.body).not.toBeNull();
      expect(response.body.login).not.toBeNull();
      expect(response.body.login.token).not.toBeNull();
      expect(
        jwt.verify(response.body.login.token, process.env.JWT_SECRET)
      ).not.toBeNull();
    });

    test("should not login when invalid user is provided", async () => {
      const response = await request(service.server.App.callback())
        .post("/login")
        .send({
          userName: "Invalid",
          password: routesFixture.validLogin.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        error: { message: "Incorrect Login", code: 111 }
      });
    });

    test("should not login when invalid password is provided", async () => {
      const response = await request(service.server.App.callback())
        .post("/login")
        .send({
          userName: routesFixture.validLogin.userName,
          password: "Invalid"
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        error: { message: "Incorrect Login", code: 111 }
      });
    });
  });
});
