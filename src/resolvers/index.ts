import { IResolvers } from 'graphql-tools';
import query from './query';
import mutation from './mutation';
import type from './type';
import subscriptionResolvers from './subscription';

const resolvers: IResolvers = {
  ...query,
  ...mutation,
  ...type,
  ...subscriptionResolvers
};

export default resolvers;
