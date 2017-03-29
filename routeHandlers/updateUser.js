const User = require('../mongoose/User');

const updateUser = async (ctx, next) => {
  const id = ctx.params.id.substring(1);
  const {name, email} = ctx.request.body;
  try {
    const update = await User.update({_id: id}, {$set: {name, email}});
    ctx.body = `I can patch user with id ${id}`;
  } catch(e) {
    ctx.body = e.toString();
  }
};

module.exports = updateUser;
