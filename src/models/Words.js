const { model, Schema } = require('mongoose');

const wordsSchema = new Schema({
  word: {
    type: String,
    required: true,
  },
});

module.exports = model('Words', wordsSchema);
