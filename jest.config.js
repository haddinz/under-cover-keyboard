module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  verbose: true,
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.svg$': '<rootDir>/__mocks__/svgTransform.js',
    '^src(.*)$': '<rootDir>/src$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!cellculture-ui-v2/.*)',
  ],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  setupFiles: ['<rootDir>/tests/test-env.js'],
};
