module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/coverage/", "/config/"],
  coverageReporters: ["json", "lcov", "text", "clover"],
  testEnvironment: "node",
  reporters: [
    "default",
    [
      "jest-sonar",
      {
        output: "jest",
      },
    ],
  ],
};
