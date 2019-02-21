const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema ({
  count : {type: Number, default: 1}
});

module.exports = mongoose.model('Counter', counterSchema);