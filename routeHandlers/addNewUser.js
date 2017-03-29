const User = require('../mongoose/User');

const addNewUser = async(ctx, next) => {
  const {email, name} = ctx.request.body;
  try {
    const user = await User.create({email, name});
    ctx.body = `${name}/${user._id}`;
  } catch(e) {
    if (e.code === 11000) {
      const response = {};
      if (e.errmsg.indexOf(email) > 0) response[email] = 'Данный email существует';
      else response[name] = 'Данный name существует';
      ctx.throw(409, JSON.stringify({
        errors: response
      }));
    } else {
      const arrayOfErrors = Object.keys(e.errors);
      const response = {};
      arrayOfErrors.forEach(error => {
        response[error] = e.errors[error].message;
      });
      ctx.throw(400, JSON.stringify({
        errors: response
      }));
    }
  }
};

module.exports = addNewUser;
