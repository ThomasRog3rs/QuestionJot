const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const UserSchema = new Schema({
  name:{
    type: String,
    require: true
  },
  email:{
    type: String,
    requre: true
  },
  password:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  }
});

//Generate model from schema
mongoose.model('users', UserSchema);