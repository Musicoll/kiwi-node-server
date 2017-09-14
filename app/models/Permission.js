// ------------------------------------------------------------------------- //
// Permission Model
// ------------------------------------------------------------------------- //

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('mongoose-shortid-nodeps');

let PermissionSchema = new Schema({

  _id: {
    type: shortId,
    len: 16,
    base: 16,
    unique: true
  },

  role: {
    type: String,
    default: 'reader'
  },

  user: {
    type: shortId,
    ref: 'User'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

});

module.exports = mongoose.model('Permission', PermissionSchema);
