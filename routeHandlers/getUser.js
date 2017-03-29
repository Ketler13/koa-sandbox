const User = require('../mongoose/User');

const getUserById = async(ctx, next) => {
  const id = ctx.params.id.substring(1);
  try {
    const user = await User.findOne({'_id': id});
    ctx.body = `${user.name}/${user.email}`;
  } catch(e) {
    ctx.throw(404, 'Sorry, invalid id');
  }
};

module.exports = getUserById;
