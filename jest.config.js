module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/test/**/*.test.(ts|js)"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
