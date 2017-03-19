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

module.exports = mongoose.model('PatcherDocument', PatcherDocumentSchema);
