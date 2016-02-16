var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  survey: { type: ObjectId, ref: 'Survey', required: true },
  question: { type: ObjectId, required: true, index: true },
  value: {}
});

module.exports = mongoose.model('Response', schema);
