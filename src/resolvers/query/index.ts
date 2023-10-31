import resolversGenreQuery from './genre';
import resolversShopProductsQuery from './shop-product';
import resolversTagQuery from './tag';
import resolversUserQuery from './user';

const GMR = require('@wiicamp/graphql-merge-resolvers'); // Import module

const queryResolver = GMR.merge([
  resolversUserQuery,
  resolversShopProductsQuery,
  resolversGenreQuery,
  resolversTagQuery
]);

export default queryResolver;
