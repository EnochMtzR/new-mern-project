import * as Router from "koa-router";
import User from "../models/user";
import * as bcrypt from "bcrypt";

interface UserRequest {
  inHotelId: string;
  name: string;
  password: string;
  hotels: [
    {
      id: string;
      name: string;
    }
  ];
  accessRights: string[];
}

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 16);
};

const servePostUser = async (router: Router) => {
  router.post("/users", async ctx => {
    const userRequest = {
      ...ctx.request.body,
      password: await hashPassword((ctx.request.body as UserRequest).password)
    };
    try {
      const user = new User(userRequest);
      ctx.body = await user.save();
    } catch (e) {
      switch (e.code) {
        case 11000:
          ctx.set("Content-Type", "application/json");
          ctx.throw({
            state: 400,
            error: { message: "User already exists.", code: 101 }
          });
        default:
          ctx.throw({
            state: 500,
            error: { message: "Internal Server Error", code: 100 }
          });
          console.error("Error Generated: ", e);
      }
    }
  });
};

export default servePostUser;
