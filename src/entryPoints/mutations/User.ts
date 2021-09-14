import { GraphQLID, GraphQLString } from 'graphql';
import { MessageType } from '../TypeDefs/Messages';
import { UserType } from '../TypeDefs/User';

export const CREATE_USER = {
  type: UserType,
  args: {
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    const { name, username, password } = args;
    return args;
  },
};

export const UPDATE_PASSWORD = {
  type: MessageType,
  args: {
    username: { type: GraphQLString },
    oldPassword: { type: GraphQLString },
    newPassword: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    const { username, oldPassword, newPassword } = args;

    if (username) {
      return { successful: true, message: 'PASSWORD UPDATED' };
    } else {
      throw new Error('PASSWORDS DO NOT MATCH!');
    }
  },
};

export const DELETE_USER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent: any, args: any) {
    const id = args.id;

    return { successful: true, message: 'DELETE WORKED' };
  },
};
