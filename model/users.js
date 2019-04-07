const mongoose = require('mongoose')
const schema = mongoose.Schema

const schema1  = new schema({
  email : {type : String, required : true},
  password : {type : String, required : true},
  // errors may found as confirmPassword is added now and not modified accordingly in other areas.
  confirmPassword : {type : String, required : true},
  firstName : {type : String, required : true},
  lastName : {type : String, required : true},
  dob : {type : Date, default : Date.now()}
})


module.exports = mongoose.model('users', schema1)