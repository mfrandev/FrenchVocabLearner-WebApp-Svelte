/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: "./Tests/testSetup.ts",
  globalTeardown: "./Tests/testTeardown.ts"
};