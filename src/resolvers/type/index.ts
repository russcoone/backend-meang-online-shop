import GMR from 'graphql-merge-resolvers';

import resolversPlatformType from './platform';
import resolversShopProductType from './shop-product';
import resolversProductType from './product';
import typeStripeResolvers from './stripe';

const typeResolvers = GMR.merge([
  resolversShopProductType,
  resolversPlatformType,
  resolversProductType,
  // stripe
  typeStripeResolvers,

]);

export default typeResolvers;
