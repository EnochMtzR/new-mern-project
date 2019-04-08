import * as path from "path";
import * as fs from "fs";

export const validServerOptions = {
  port: 8080,
  serveStaticFiles: {
    publicFolder: path.join(__dirname, "..", "..", "..", "public"),
    fallback: "index.html"
  },
  serveSSL: {
    certificatePath: path.join(__dirname, "..", "..", "..", "/server.crt"),
    keyPath: path.join(__dirname, "..", "..", "..", "key.pem"),
    keyPassword: ""
  }
};

export const expectedSslOptions = {
  cert: fs.readFileSync(validServerOptions.serveSSL.certificatePath),
  key: fs.readFileSync(validServerOptions.serveSSL.keyPath),
  passphrase: validServerOptions.serveSSL.keyPassword,
  allowHTTP1: true
};
