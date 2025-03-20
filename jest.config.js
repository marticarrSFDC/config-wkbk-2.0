import { jestConfig } from '@salesforce/sfdx-lwc-jest/config';

module.exports = {
    ...jestConfig,
    modulePathIgnorePatterns: ['<rootDir>/.localdevserver'],
    preset: '@lwc/jest-preset',
    moduleFileExtensions: ['js', 'html'],
    coverageThreshold: {
        global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
        },
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'json', 'json-summary', 'lcov'],
};
