import { AuthError, SystemError } from '../../errors';
import { User } from '../../models';

export default {
  Query: {
    users: () => User.find(),
    user: (parent, { id }) => User.findOneById(id),
    currentUser: (parent, args, { user }) => {
      if (!user) {
        throw new AuthError();
      }
      return user;
    }
  },
  Mutation: {
    signup: async (parent, args) => {
      try {
        const user = await User.create(args).save();
        return { token: user.generateToken(), user };
      } catch (err) {
        throw new SystemError({ message: err.message });
      }
    },
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ where: { email } });
        return { token: user.generateToken(), user };
      } catch (err) {
        throw new SystemError({ message: err.message });
      }
    }
  }
};
