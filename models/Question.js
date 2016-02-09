var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  name: { type: String },
  organization: { type: ObjectId, ref: 'Organization', required: true },
  frequency: {type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly']},
  type: {type: String, enum: ['one-answer', 'multi-answer']}
});

module.exports = mongoose.model('Question', schema);
