import { createError } from 'apollo-errors';

export default createError('AuthenticationError', {
  message: 'Authentication'
});
