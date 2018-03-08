import { AuthenticationError } from '../../errors';

export default (next, src, { roles }, { user }) => {
  if (user) {
    // check roles
    // const expectedRoles = <string[]>(roles || []);
    // if (
    //   expectedRoles.length === 0 ||
    //   expectedRoles.some(role => user.hasRole(role))
    // ) {
    return next();
    // }
  }

  throw new AuthenticationError();
};
