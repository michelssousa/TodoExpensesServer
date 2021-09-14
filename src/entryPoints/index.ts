import {
  CREATE_USER,
  DELETE_USER,
  UPDATE_PASSWORD,
} from '@src/entryPoints/mutations/User';
import { GET_ALL_USERS } from '@src/entryPoints/queries/User';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    userGetAll: GET_ALL_USERS,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    userCreate: CREATE_USER,
    userPasswordUpdate: UPDATE_PASSWORD,
    userDelete: DELETE_USER,
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
