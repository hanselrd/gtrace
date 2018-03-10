import { createError } from 'apollo-errors';

export default createError('UnhandledError', {
  message: 'Unhandled'
});
