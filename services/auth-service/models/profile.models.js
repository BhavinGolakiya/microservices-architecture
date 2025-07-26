const mongoose = require('mongoose');
module.exports = mongoose.model('Profile', new mongoose.Schema({
  userId: { type: String, unique: true },
  email: String,
  name: String,
  age: Number,
}));
