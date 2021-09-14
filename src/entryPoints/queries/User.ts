import { UserType } from '@src/entryPoints/TypeDefs/User';
import { GraphQLList } from 'graphql';

export const GET_ALL_USERS = {
  type: new GraphQLList(UserType),
  resolve() {
    return [];
  },
};
