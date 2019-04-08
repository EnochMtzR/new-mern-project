import * as tls from "tls";
import * as fs from "fs";

interface Options {
  ca: Buffer[];
  rejectUnauthorized: boolean;
}

interface ConnectionResponse {
  success: boolean;
}

/**
 *
 *
 * NetTalk Class:
 * Creates a NetTalk Object for making request to a NetTalk Service in WPP (Whole Packet Protocol).
 *
 */
export default class NetTalk {
  WPP: boolean;
  port: number;
  server: string;
  options: Options;
  msgSize: number;
  wholePackage: Buffer;
  socket: tls.TLSSocket;
  verify: string;
  end = false;

  constructor(
    port: number,
    server: string,
    certificate: string,
    wpp = true,
    verify = "0"
  ) {
    this.port = port;
    this.server = server;
    this.options = {
      ca: [fs.readFileSync(certificate)],
      rejectUnauthorized: false
    };
    this.msgSize = 0;
    this.wholePackage = new Buffer("");
    this.socket = null;
    this.verify = verify;
    this.WPP = wpp;
  }

  /**
   *
   * Connects to the NetTalk Service.
   * @memberof NetTalk
   */
  connect() {
    this.socket = tls.connect(
      this.port,
      this.server,
      this.options,
      () => {
        process.stdin.pipe(this.socket);
        process.stdin.resume();
      }
    );

    this.socket.setTimeout(20000, () => {
      console.log("Connection timed out.");
      this.socket.destroy();
    });

    this.socket.on("end", () => {
      console.log("Connection terminated.");
    });

    this.socket.on("timeout", () => {
      console.log("Connection timed out.");
      this.socket.destroy();
    });

    return new Promise<ConnectionResponse>((resolve, reject) => {
      this.socket.on("ready", () => {
        console.log(
          `client connected on port ${this.port} to server ${this.server}`
        );
        resolve({ success: true });
      });

      this.socket.on("error", err => {
        reject({ err: err, func: "connect" });
      });
    });
  }

  /**
   * sends the request.
   *
   * @param {String} reqMsg Request Message to be sent to the service.
   * @returns {Promise} {Promise.<resolve(data)|reject(error)>}
   * @memberof NetTalk
   */
  async request(reqMsg: string) {
    const connection = await this.connect();

    if (connection.success) {
      return new Promise((resolve, reject) => {
        /*Adding 32 bit length Integer to the beginning of stream 
            for compatibility with WPP (Whole Packet Protocol).*/
        var message = new Buffer(reqMsg, "binary");
        var stream = new Buffer(4 + message.length); //declares the stream to be sent.

        stream.writeInt32LE(message.length, 0); //Must be in LittleEndian for compatibility.
        message.copy(stream, 4);

        console.log(this.WPP);
        if (this.WPP) {
          console.log(stream);
          this.socket.write(stream);
        } else {
          this.socket.write(message);
        }

        this.socket.on("data", (data: Buffer) => {
          this.wholePackage = Buffer.concat([this.wholePackage, data]);
          const wholePackageSize = this.wholePackage;
          this.msgSize += data.length;

          console.log(wholePackageSize);

          console.log(wholePackageSize.readInt16BE(this.msgSize - 2));

          if (
            wholePackageSize.readUInt32LE(0) <= this.msgSize ||
            wholePackageSize.readInt16BE(this.msgSize - 2) === 3338
          ) {
            this.socket.end();
          }
        });

        this.socket.on("timeout", () => {
          this.socket.destroy();
          reject({ err: "Error!, server do not respond", func: "request" });
        });

        this.socket.on("end", () => {
          if (this.WPP) {
            resolve(this.wholePackage.toString("utf8", 4));
          } else {
            resolve(this.wholePackage.toString("utf8", 0));
          }
        });

        this.socket.on("error", err => {
          reject({ err: err, func: "request" });
        });
      });
    } else {
      return { err: "could not connect to service" };
    }
  }
}
