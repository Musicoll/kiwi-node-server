/**
 * File data Model
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const materialized = require('mongoose-materialized');

let FileSchema = new Schema({

  name: {
    type: String,
    default: 'Untitled'
  },

  isFolder: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

});

FileSchema.plugin(materialized);

module.exports = mongoose.model('File', FileSchema);
