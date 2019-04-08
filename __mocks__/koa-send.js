const snd = require("koa-send");

module.exports = jest.fn((ctx, path, options) => {
  return snd(ctx, path, options);
});
