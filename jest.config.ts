import type { Config } from "jest";

const config: Config = {
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*_)+(spec|test).ts"],
  testTimeout: 10000,
  roots: ["<rootDir>/src"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
