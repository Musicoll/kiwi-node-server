var mongoose = require('mongoose');

// Create a schema
let PatcherDocumentSchema = new mongoose.Schema({
  name: { type: String, default: "Untitled" },
  updated_at: { type: Date, default: Date.now },
});

// Create and export the PatcherDocument model based on the PatcherDocument schema
module.exports = mongoose.model('PatcherDocument', PatcherDocumentSchema);
