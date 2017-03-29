const User = require('../mongoose/User');

const updateUser = async (ctx, next) => {
  const id = ctx.params.id.substring(1);
  const {field, type} = ctx.request.body;
  const opts = {runValidators: true};
  try {
    const update = await User.update({_id: id}, {$set: {[type]: field}}, opts);
    ctx.body = `User with ${id} was changed to ${field}`;
  } catch(e) {
    ctx.throw(400, e.errors[type].message);
  }
};

module.exports = updateUser;
