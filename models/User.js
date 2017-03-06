let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// Create a User schema
let UserSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },

  username: String

}, { strict: true });

/**
 * Password Hashing Middleware
 * hash the password if it's a new password or if it has been modified.
 */
UserSchema.pre('save', function (next) {

  let user = this;
  if(user.isModified('password')) {
    bcrypt.hash(user.password, SALT_WORK_FACTOR)
    .then((pwd_hash) => {
      user.password = pwd_hash;
      next();
    })
    .catch((err) => {
      next(err);
    });
  }

  next();
});

/**
 * Called before an update of the User
 * Hash password if it is a field of the update query
 * Note: We do not have access to the actual document here,
 * so updating a user with the same password will change its hash !
 */
function preUpdate(next) {

  let query = this;
  let update = query.getUpdate();

  if (update.$set) {
    update = update.$set;
  }

  if(update.password) {
    bcrypt.hash(update.password, SALT_WORK_FACTOR)
    .then((pwd_hash) => {
      update.password = pwd_hash;
      next();
    })
    .catch((err) => {
      next(err);
    });
  }

  next();
}

UserSchema.pre('update', preUpdate);
UserSchema.pre('findOneAndUpdate', preUpdate);

/**
 * Password Verification
 * Test if this password is equal to another one
 * @param {String} pwd - the candidate password to test
 * @return {Promise} A promise object
 */
UserSchema.methods.comparePassword = function (pwd) {

  return bcrypt.compare(pwd, this.password);

};

// Create and export the User model based on the User schema
module.exports = mongoose.model('User', UserSchema);
