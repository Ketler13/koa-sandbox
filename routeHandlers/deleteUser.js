const User = require('../mongoose/User');

const deleteUser = async (ctx, next) => {
  const id = ctx.params.id.substring(1);
  try {
    const deleted = await User.remove({_id: id});
    console.log('deleted', deleted.message.data.toString());
    if (deleted.result.n) {
      ctx.body = 'User was deleted';
    } else {
      ctx.throw(404, 'No such user');
    }
  } catch(e) {
    console.log('error', e);
    if (e.message === 'No such user') {
      ctx.throw(404, 'No such user');
    } else if (e.name === 'CastError') {
      ctx.throw(400, 'Field is empty')
    }
  }
};

module.exports = deleteUser;
