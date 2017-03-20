/**
 * Patcher document data Model
 */

let mongoose = require('mongoose');
let shortId = require('mongoose-shortid-nodeps');

let PatcherDocumentSchema = new mongoose.Schema({
  session_id: {
    type: shortId,
    len: 16,
    base: 16,
    index: true
  },
  name: { type: String, default: "Untitled" },
  updated_at: { type: Date, default: Date.now },
});

/**
 * Patcher document validator
 */
 PatcherDocumentSchema.pre('save', function (next) {

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
  if( !('name' in update) || !update.name) {
     update.name = 'Untitled';
  }

  next();
}

PatcherDocumentSchema.pre('update', preUpdate);
PatcherDocumentSchema.pre('findOneAndUpdate', preUpdate);

module.exports = mongoose.model('PatcherDocument', PatcherDocumentSchema);
