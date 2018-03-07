import { createError } from 'apollo-errors';

export default createError('AuthError', {
  message: 'Auth'
});
