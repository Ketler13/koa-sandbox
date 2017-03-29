const User = require('../mongoose/User');

const deleteUser = async (ctx, next) => {
  const id = ctx.params.id.substring(1);
  try {
    const deleted = await User.remove({_id: id});
    if (deleted.result.n) {
      ctx.body = 'User was deleted';
    } else {
      ctx.throw(404, 'No such user');
    }
  } catch(e) {
    if (e.name === 'CastError' || e.message === 'No such user') {
      ctx.throw(404, 'No such user');
    }
  }
};

module.exports = deleteUser;
