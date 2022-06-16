/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.jest.json",
    },
  },
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/mocks/fileMock.js",
    "\\.(css|less)$": "<rootDir>/mocks/fileMock.js",
    "^.+\\.(css|less|scss)$": "babel-jest",
    "^@components(.*)$": "<rootDir>/src/components$1",
    "^@pages(.*)$": "<rootDir>/src/pages$1",
    "^@src(.*)$": "<rootDir>/src/$1",
    "^@shared(.*)$": "<rootDir>/src/shared$1",
    "^@store(.*)$": "<rootDir>/src/store$1",
    "^@assets(.*)$": "<rootDir>/src/assets$1",
    "^@consts(.*)$": "<rootDir>/src/constants$1",
    "^@models(.*)$": "<rootDir>/src/models$1",
    "^@api(.*)$": "<rootDir>/src/api$1",
    "^@utils(.*)$": "<rootDir>/src/utils$1",
    "^@translations(.*)$": "<rootDir>/src/translations$1",
  },
};
