import { createError } from 'apollo-errors';

export default createError('SystemError', {
  message: 'System'
});
