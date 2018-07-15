var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt       = require('bcrypt');

var UserSchema   = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: String,
    age: String,
    dateCreated: String,
    birthdate: String,
    charCount: String,
    token: String,
    admin: Boolean,
    expansionOwnership: String
});

//hashing password before saving
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next (err);
    }
    user.password = hash;
    next();
  })
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

UserSchema.statics.usernameAuthenticate = function (username, password, callback) {
  this.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}


module.exports = mongoose.model('User', UserSchema);
