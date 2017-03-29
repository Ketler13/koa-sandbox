const User = require('../mongoose/User');

const addNewUser = async(ctx, next) => {
  const {email, name} = ctx.request.body;
  try {
    const user = await User.create({email, name});
    ctx.body = `${name}/${user._id}`;
  } catch(e) {
    if (e.code === 11000) {
      ctx.throw(409, 'Sorry, user exists');
    }
  }
};

module.exports = addNewUser;
