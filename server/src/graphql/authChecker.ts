import { AuthChecker } from 'type-graphql';
import { AuthenticationError, PermissionError } from '../errors';
import { User } from '../models';

export const authChecker: AuthChecker<{ user?: User }> = (
  { root, context: { user } },
  roles
) => {
  if (user) {
    if (roles.length === 0) {
      return true;
    } else if (roles.length === 1 && roles[0] === 'private') {
      if (user.id === root.id) {
        return true;
      }
      return false;
    } else if (
      user.role &&
      roles.some(abbr => user.role.abbreviation === abbr)
    ) {
      return true;
    } else {
      throw new PermissionError({
        message: `This action requires the following roles: [${roles}]`
      });
    }
  }
  throw new AuthenticationError();
};

export default authChecker;
