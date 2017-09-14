// ------------------------------------------------------------------------- //
// Document Model
// ------------------------------------------------------------------------- //

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('mongoose-shortid-nodeps');
const materialized = require('mongoose-materialized');
const { mongoosePlugin } = require('casl')

const DocumentSchema = new Schema({

  _id: {
    type: shortId,
    len: 16,
    base: 16,
    unique: true
  },

  name: {
    type: String,
    default: "Untitled"
  },

  description: {
    type: String,
  },

  mimeType: {
    type: String,
    required: true,
  },

  createdTime: {
    type: Date,
    default: Date.now
  },

  creator: {
    type: shortId,
    ref: 'User'
  },

  owner: {
    type: shortId,
    ref: 'User'
  },

  trashed: {
    type: Boolean,
    default: false
  },

/*
  permissions: {
    type: [shortId],
    ref: 'Permission'
  }
*/

});

DocumentSchema.virtual('isFolder').get(function() {
  return this.mimeType === "application/cicm.kiwiapp.folder";
});

DocumentSchema.methods.toJSON = function() {
  let obj = this.toObject();
  obj.kind = 'Kiwi#Document';
  return obj;
}

/**
 * Document validator
 */
 DocumentSchema.pre('save', function(next) {

   let doc = this;

   // reset name to 'Untitled' if is unset or blank.
   if( !('name' in doc) || !doc.name) {
      doc.name = 'Untitled';
   }

   next();

});

DocumentSchema.plugin(mongoosePlugin)
DocumentSchema.plugin(materialized);

module.exports = mongoose.model('Document', DocumentSchema);
