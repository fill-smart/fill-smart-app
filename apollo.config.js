module.exports = {
  client: {
    service: 'fillsmart-dev',
    skipSSLValidation: true,
    excludes: ['node_modules/**/*'],
    includes: ['hooks/**/*.{ts,gql,tsx,js,jsx,graphql}'],
  },
};
