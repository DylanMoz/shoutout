var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  organization: { type: String }, // TODO foreign key relation},

});

module.exports = mongoose.model('Employee', schema);
