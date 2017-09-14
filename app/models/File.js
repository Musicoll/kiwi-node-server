// ------------------------------------------------------------------------- //
// File Model
// ------------------------------------------------------------------------- //

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('mongoose-shortid-nodeps');
const materialized = require('mongoose-materialized');
const { mongoosePlugin } = require('casl')

let FileSchema = new Schema({

  _id: {
    type: shortId,
    len: 16,
    base: 16,
    unique: true
  },

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
    type: shortId,
    ref: 'User'
  },

  documentRef: {
    type: shortId,
    ref: 'Document'
  },

});

FileSchema.plugin(mongoosePlugin)
FileSchema.plugin(materialized);

module.exports = mongoose.model('File', FileSchema);
