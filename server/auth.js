const jwt = require('jsonwebtoken');
const models = require('./models');

/*
  Takes a token and validates it,
  if token is good then a user model is returned,
  if not then it returns null
*/
module.exports = async token => {
  try {
    const decoded = jwt.decode(token.replace('Bearer ', ''));

    if (!decoded) {
      return null;
    }

    const { sub } = decoded;
    const user = await models.User.findOne({
      where: { id: sub },
      include: [models.Message, models.Role]
    });

    jwt.verify(
      token.replace('Bearer ', ''),
      user.password + process.env.SECRET
    );
    return user;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};
