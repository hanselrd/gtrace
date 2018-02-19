module.exports = (err, models) => {
  if (err instanceof models.sequelize.ValidationError) {
    return err.errors.map(({ path, message }) => ({ path, message }));
  } else {
    return [{ path: 'name', message: 'Something went wrong' }];
  }
};
