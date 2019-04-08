import * as Router from "koa-router";
import * as jwt from "jsonwebtoken";
import * as uuid from "uuid/v4";
import * as moment from "moment";
import * as bcrypt from "bcrypt";
import User, { IUser } from "../models/user";

interface LoginRequest extends Body {
  userName: string;
  password: string;
}

export const getUser = async (userName: string, passwd: string) => {
  try {
    let matchedUser = (await User.findOne({
      name: userName
    }).lean()) as IUser;

    if (matchedUser && !(await bcrypt.compare(passwd, matchedUser.password))) {
      return null;
    }

    return matchedUser;
  } catch (e) {
    console.error(e);
  }
};

export const getJWT = (user: IUser) => {
  const payload = {
    userUId: uuid(),
    userId: user._id,
    name: user.name,
    iat: Number(moment().format())
  };

  const options: jwt.SignOptions = { expiresIn: "24h" };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export const loginUser = async (user: IUser, token: String) => {
  const returned = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        login: {
          lastLogin: moment(),
          token: token
        }
      }
    },
    { new: true }
  ).lean();

  return returned as IUser;
};

const serveLogin = async (router: Router) => {
  router.post("/login", async ctx => {
    try {
      const login = ctx.request.body as LoginRequest;
      const user = await getUser(login.userName, login.password);
      if (user) {
        const token = getJWT(user);
        const { password, __v, ...loggedUser } = (await loginUser(
          user,
          token
        )) as IUser;

        const { login, ...loggedUserRestData } = loggedUser;

        const loginData = { ...loggedUserRestData, token: login.token };

        ctx.body = loginData;
      } else {
        ctx.body = { error: { message: "Incorrect Login", code: 111 } };
      }
    } catch (e) {
      if (!e.state) {
        ctx.throw({
          state: 500,
          error: { message: "Internal Error", code: 100 }
        });
      } else {
        ctx.throw(e);
      }
    }
  });
};

export default serveLogin;
