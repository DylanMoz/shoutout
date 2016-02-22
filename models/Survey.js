var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var question = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number },
  type: {type: String, enum: 'select slider'.split(' '), required: true}
});

var schema = new mongoose.Schema({
  questions: [question],
  organization: { type: ObjectId, ref: 'Organization', required: true, index: true },
  state: { type: String, enum: 'draft locked'.split(' ')}
});

schema.statics.State = function() {
  return {
    DRAFT : 'draft',
    LOCKED : 'locked'
  }
}

schema.statics.QuestionType = function() {
  return {
    INPUT: 'input',
    SLIDER: 'slider'
  }
}

module.exports = mongoose.model('Survey', schema);
