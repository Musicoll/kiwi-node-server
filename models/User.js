let mongoose = require('mongoose');

// Create a User schema
let UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String
});

// Create and export the User model based on the User schema
module.exports = mongoose.model('User', UserSchema);
