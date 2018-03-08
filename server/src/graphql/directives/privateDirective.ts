import { PermissionError } from '../../errors';
import authDirective from './authDirective';

export default (next, src, args, context) => {
  return authDirective(
    () => (src.id === context.user.id ? next() : null),
    src,
    args,
    context
  );
};
