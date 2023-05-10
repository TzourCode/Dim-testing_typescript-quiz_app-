export {}
module.exports = {
  testMatch: ['**/*.feature.ts'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
