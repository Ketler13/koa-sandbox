const User = require('../mongoose/User');

const getAllUsers = async(ctx, next) => {
  const users = await User.find();
  const response = users.map(user => `${user.name}/${user._id}/${user.email}`);
  if (!response.length) {
    ctx.body = 'Sorry, no users yet';
  } else {
    ctx.body = response.join('_');
  }
};

module.exports = getAllUsers;
