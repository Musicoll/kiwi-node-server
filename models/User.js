let mongoose = require('mongoose');

// Create a User schema
let UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: String,
});

// Create and export the User model based on the User schema
module.exports = mongoose.model('User', UserSchema);
