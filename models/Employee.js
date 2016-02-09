var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  organization: { type: ObjectId, ref: 'Organization', required: true },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true }
  }
});

module.exports = mongoose.model('Employee', schema);
