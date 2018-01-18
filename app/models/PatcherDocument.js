// ------------------------------------------------------------------------- //
// Document Model
// ------------------------------------------------------------------------- //

const mongoose = require('mongoose');
const shortId = require('mongoose-shortid-nodeps');

const PatcherDocumentSchema = new mongoose.Schema({

  session_id: {
    type: shortId,
    len: 16,
    base: 16,
    unique: true
  },

  name: {
    type: String,
    default: "Untitled"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  createdBy: {
      type: shortId,
      ref: 'User',
      required: true
  },

  trashed: {
      type: Boolean,
      required: true,
      default: false
  },

  trashedDate: {
      type: Date,
      required: false
  },

  trashedBy: {
      type: shortId,
      ref: 'User',
  }

});

/**
 * Patcher document validator
 */
 PatcherDocumentSchema.pre('save', function(next) {

   let doc = this;

   // reset name to 'Untitled' if is unset or blank.
   if( !('name' in doc) || !doc.name) {
      doc.name = 'Untitled';
   }

   next();

});

/**
 * Called before an update of the Document
 */
function preUpdate(next) {

  let query = this;
  let update = query.getUpdate();

  if (update.$set) {
    update = update.$set;
  }

  // reset name to 'Untitled' if is unset or blank.
  if( 'name' in update && update.name == "") {
     update.name = 'Untitled';
  }

  if ('trashed' in update){
      if (update.trashed == true){
          if (!update.trashedBy || !update.trashedDate){
              let err = new Error('Document can\'t update trashed field')
              err.code = 'Trash'
              next(err)
          }
      }
      else{
          query.getUpdate().$unset = {trashedBy: "", trashedDate: ""};
      }
  }

  if ( 'createdBy' in update) {
      let err = new Error('Document Can\'t update createdBy field')
      err.code = 'CreatedBy'
      next(err);
  }

  next();
}

PatcherDocumentSchema.pre('update', preUpdate);
PatcherDocumentSchema.pre('findOneAndUpdate', preUpdate);

module.exports = mongoose.model('PatcherDocument', PatcherDocumentSchema);
