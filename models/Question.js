const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const QuestionSchema = new Schema({
  title:{
    type: String,
    require: true
  },
  answer:{
    type: String,
    require: true
  },
  user: {
    type: String,
    require: true
  },
  date:{
    type: Date,
    default: Date.now
  }
});

//Generate model from schema
mongoose.model('questions', QuestionSchema);