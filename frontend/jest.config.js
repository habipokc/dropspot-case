// frontend/jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '^react$': '<rootDir>/node_modules/react',
        '^@/components/(.*)$': '<rootDir>/components/$1',
        '^@/lib/(.*)$': '<rootDir>/lib/$1',
    },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    transformIgnorePatterns: [
        'node_modules/(?!zustand|@?react)/',
    ],
};

module.exports = createJestConfig(customJestConfig);
