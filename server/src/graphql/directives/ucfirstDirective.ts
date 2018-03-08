export default (next, src, args, context) => {
  return next().then(str => {
    if (typeof str === 'string') {
      return str[0].toUpperCase() + str.substr(1);
    }
    return str;
  });
};
