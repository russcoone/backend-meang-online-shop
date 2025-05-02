import resolversMailMutation from './email';
import resolversGenreMutation from './genre';
import resolverShopProductMutation from './shop-product';
import mutationStripeResolver from './stripe';
import resolversTagMutation from './tag';
import resolversUserMutation from './user';

const GMR = require('@wiicamp/graphql-merge-resolvers'); // Import module

const mutationResolvers = GMR.merge([
  resolversUserMutation,
  resolversGenreMutation,
  resolversTagMutation,
  resolversMailMutation,
  mutationStripeResolver,
  resolverShopProductMutation
]);

export default mutationResolvers;
