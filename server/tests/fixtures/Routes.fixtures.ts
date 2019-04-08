import Router from "koa-router";
import * as bcrypt from "bcrypt";

export const testRoute = jest.fn((router: Router) => {});

export const validLogin = {
  userName: "test",
  password: "testPassword"
};

export const testUser = {
  name: "test",
  password: bcrypt.hashSync("testPassword", 1),
  hotels: [
    {
      hotelId: "1",
      hotelName: "testHotel"
    }
  ],
  accessRights: ["login"]
};
