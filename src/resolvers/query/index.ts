import resolverDashboardQuery from './dashborad';
import resolversGenreQuery from './genre';
import resolversShopProductsQuery from './shop-product';
import queryStripeResolvers from './stripe';
import resolversTagQuery from './tag';
import resolversUserQuery from './user';

const GMR = require('@wiicamp/graphql-merge-resolvers'); // Import module

const queryResolver = GMR.merge([
  resolversUserQuery,
  resolversShopProductsQuery,
  resolversGenreQuery,
  resolversTagQuery,
  queryStripeResolvers,
  resolverDashboardQuery
]);

export default queryResolver;
