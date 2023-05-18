const mongoose = require('mongoose');

const screenshotSchema = new mongoose.Schema({
  data: String,
  date: { type: Date, default: Date.now }
});

const Screenshot = mongoose.model('screenshots', screenshotSchema);

module.exports = Screenshot;