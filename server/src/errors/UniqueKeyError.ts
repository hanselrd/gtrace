import { createError } from 'apollo-errors';

export default createError('UniqueError', {
  message: 'Unique key'
});
