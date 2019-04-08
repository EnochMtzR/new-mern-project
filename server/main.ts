import "./config/config";
import * as db from "./db/mongoose";
import Server, { ServerOptions } from "./Server";
import serveLogin from "./routes/login.route";
import servePostUser from "./routes/postUsers.route";

export const options: ServerOptions = JSON.parse(process.env.serverOptions);
export const server = new Server(options);

db.connectDB();

server.routes.add(serveLogin);
server.routes.add(servePostUser);

server.startServer();
