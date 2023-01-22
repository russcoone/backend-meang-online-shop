import resolversUserMutation from './user';

const GMR = require('@wiicamp/graphql-merge-resolvers'); // Import module

const mutationResolvers = GMR.merge([resolversUserMutation]);

export default mutationResolvers;
