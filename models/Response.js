var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  survey: { type: ObjectId, ref: 'Survey', required: true },
  employee: { type: ObjectId, ref: 'Employee', required: true },
  answers: [{
  	_id: String,
  	name: String,
  	response: String
  }],
  submitted: Date,
});

module.exports = mongoose.model('Response', schema);
