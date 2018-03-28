import { AuthenticationError, PermissionError } from '../../errors';

export default (next, src, { roles }, { user }) => {
  if (user) {
    const expectedRoles = <string[]>(roles || []);
    if (expectedRoles.length === 0) {
      return next();
    } else if (
      user.role &&
      expectedRoles.some(role => user.role.abbreviation === role)
    ) {
      return next();
    } else {
      throw new PermissionError({
        message: `This action requires the following roles: [${roles}]`
      });
    }
  }

  throw new AuthenticationError();
};
