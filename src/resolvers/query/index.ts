import resolversGenreQuery from './genre';
import resolversProductsQuery from './product';
import resolversUserQuery from './user';

const GMR = require('@wiicamp/graphql-merge-resolvers'); // Import module

const queryResolver = GMR.merge([
  resolversUserQuery,
  resolversProductsQuery,
  resolversGenreQuery,
]);

export default queryResolver;
