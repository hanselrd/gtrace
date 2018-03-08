import { createError } from 'apollo-errors';

export default createError('NotFoundError', {
  message: 'Not found'
});
