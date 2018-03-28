import { createError } from 'apollo-errors';

export default createError('LoginError', {
  message: 'Login'
});
