const mongoose = require('mongoose');
mongoose.Promise = Promise;
//mongoose.set('debug', true);

mongoose.connect('mongodb://localhost/users', {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize:      5
  }
});

module.exports = mongoose;
