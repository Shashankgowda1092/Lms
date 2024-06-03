const { defaults } = require("jest-config");

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    "mts",
    "cts",
    "css",
    "scss",
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/src/__mocks__/styleMock.js",
  },
};

module.exports = config;
