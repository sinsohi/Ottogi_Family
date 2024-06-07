module.exports = {
  instrumentation: {
    root: './test',
    extensions: ['.js', '.jsx'],
    excludes: ['**/node_modules/**', '**/tests/**'],
  },
  reporting: {
    dir: './coverage',
    reports: ['lcov', 'text-summary'],
  },
};
