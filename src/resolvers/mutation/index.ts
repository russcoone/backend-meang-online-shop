import resolversMailMutation from './email';
import resolversGenreMutation from './genre';
import resolversTagMutation from './tag';
import resolversUserMutation from './user';

const GMR = require('@wiicamp/graphql-merge-resolvers'); // Import module

const mutationResolvers = GMR.merge([
  resolversUserMutation,
  resolversGenreMutation,
  resolversTagMutation,
  resolversMailMutation,
]);

export default mutationResolvers;
