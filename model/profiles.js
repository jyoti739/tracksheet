const mongoose = require('mongoose')
const schema = mongoose.Schema

const profileSchema = new schema({
  user : {
    type : schema.Types.ObjectId,
    ref : 'users'
  },
  handle :{
    type : String,
    required : true,
    max : 40
  },
  date : {
    type : String, 
    required : false,  // added now for change too lazy to use github now
    // default : new Date()
  },
  platforms : {
    type : [String], 
    required : true
  },
  application : {
    type : [String],
  },
  others : {
    type : String
  },
  descriptions : {
    type : String
  },
  hours : {
    type : Number,
    required : true
  }
})

module.exports = mongoose.model('profiles', profileSchema) 