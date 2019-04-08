const srv = require("koa-static");

module.exports = jest.fn((root, options) => {
  return srv(root, options);
});
