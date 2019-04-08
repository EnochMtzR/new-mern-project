import * as Koa from "koa";

export interface IError {
  status: number;
  error: {
    code: number;
    message: string;
    [x: string]: any;
  };
}

export default function errorHandling() {
  return async function errorHandling(
    ctx: Koa.Context,
    next: () => Promise<any>
  ) {
    try {
      await next();
    } catch (e) {
      ctx.status = e.state;
      ctx.body = e.error;
      console.error("Error Generated:", JSON.stringify(e.error));
    }
  };
}
