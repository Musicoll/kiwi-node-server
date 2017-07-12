/**
 * File data Model
 */

const mongoose = require('mongoose');
const materialized = require('mongoose-materialized');

//const fileTypes = ['', '','c']

let FileSchema = new mongoose.Schema({

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

  /*
  createdBy: {
    type: ObjectId
  }
  */

});

FileSchema.plugin(materialized);

module.exports = mongoose.model('File', FileSchema);
