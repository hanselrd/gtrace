import { createError } from 'apollo-errors';

export default createError('PermissionError', {
  message: 'Permission'
});
