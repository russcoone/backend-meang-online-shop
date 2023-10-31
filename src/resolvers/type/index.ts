import GMR from 'graphql-merge-resolvers';

import resolversPlatformType from './platform';
import resolversShopProductType from './shop-product';
import resolversProductType from './product';

const typeResolvers = GMR.merge([
  resolversShopProductType,
  resolversPlatformType,
  resolversProductType,
]);

export default typeResolvers;
