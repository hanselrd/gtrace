import { LoginError, SignupError } from '../../errors';
import { User } from '../../models';

export default {
  Query: {
    users: () => User.find(),
    user: (parent, { id }) => User.findOneById(id),
    currentUser: (parent, args, { user }) => user
  },
  Mutation: {
    signup: async (parent, args) => {
      try {
        const user = await User.create(args).save();
        return { token: user.generateToken(), user };
      } catch (err) {
        throw new SignupError(err);
      }
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new LoginError({ message: 'No user exists with that email' });
      }
      if (!await user.authenticate(password)) {
        throw new LoginError({ message: 'Password is incorrect' });
      }
      return { token: user.generateToken(), user };
    }
  }
};
