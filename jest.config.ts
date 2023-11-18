import type { Config } from "jest";

const config: Config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: ["**/**.[jt]s?(x)"],
  testTimeout: 10000,
};

export default config;
