import { SystemError } from '../../errors';
import { Role, User } from '../../models';

export default {
  Role: {
    users: parent => User.find({ where: { role: parent.id } })
  },
  Query: {
    roles: () => Role.find(),
    role: (parent, { id }) => Role.findOneById(id)
  },
  Mutation: {
    addRole: async (parent, { name, abbreviation, color }) => {
      try {
        const role = await Role.create({
          name,
          abbreviation: abbreviation || name,
          color
        }).save();
        return role;
      } catch (err) {
        throw new SystemError(err);
      }
    }
  }
};
