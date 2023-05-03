import resolversGenreMutation from './genre';
import resolversUserMutation from './user';

const GMR = require('@wiicamp/graphql-merge-resolvers'); // Import module

const mutationResolvers = GMR.merge([
  resolversUserMutation,
  resolversGenreMutation,
]);

export default mutationResolvers;
