// ------------------------------------------------------------------------- //
// User Model
// ------------------------------------------------------------------------- //

const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const shortId = require('mongoose-shortid-nodeps');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

// Create a User schema
const UserSchema = new mongoose.Schema({

  _id: {
    type: shortId,
    len: 16,
    base: 16
  },

  username: {
    type: String,
    required: true,
    unique: true,
    validate: validate({
      validator: 'isLength',
      arguments: [3, 60],
      message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    })
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: validate({
      validator: 'isEmail',
      message: 'The e-mail is not valid !'
    }),
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

}, { strict: true });

/**
 * override the toJSON method for the UserModel to always omit the password field
 */
UserSchema.methods.toJSON = function() {
  let obj = this.toObject();
  delete obj.password
  return obj;
}

/**
 * Password Hashing Middleware
 * hash the password if it's a new password or if it has been modified.
 */
 UserSchema.pre('save', function (next) {

   let user = this;
   if(!user.isModified('password')) {
     next();
   }

   bcrypt.hash(user.password, SALT_WORK_FACTOR)
   .then(pwd_hash => {
     user.password = pwd_hash;
     next();
   })
   .catch(err => {
     next(err);
   });

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
  else {
    next();
  }
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

// To avoid mongoose overwriteModelError
module.exports = (mongoose.models.User) ? mongoose.model('User') : mongoose.model('User', UserSchema);
