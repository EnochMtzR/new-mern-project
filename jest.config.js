module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupFiles: ["raf/polyfill", "<rootDir>/src/setupTests.ts"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  testRegex: "(test|spec).tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  collectCoverageFrom: [
    "!src/**/*.d.ts",
    "src/**/*.{ts,tsx}",
    "server/**/*.{ts,tsx}",
    "!src/index.tsx",
    "!src/**/*.fixtures.ts"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/tests/__mocks__/fileMock.js",
    "\\.(scss|css|less)$": "<rootDir>/src/tests/__mocks__/styleMock.js",
    "^app(.*)$": "<rootDir>/src$1",
    "^store(.*)$": "<rootDir>/src/store$1",
    "^common(.*)$": "<rootDir>/src/common$1",
    "^commonComponents(.*)$": "<rootDir>/src/common/components$1"
  }
};
