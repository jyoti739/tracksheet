const mongoose  = require('mongoose')
const schema = mongoose.Schema
const ObjectId = schema.Types.ObjectId
const newSchema = new schema({
  _id : {type : ObjectId, required : true},
  date  : {type : String, required : true},
  activity : {type : String, reqired : true},
  descriptions : {type : String, required : true},
  user : {
      type : schema.Types.ObjectId,
      ref : "users" 
  }
})

module.exports = mongoose.model("data_demo_1", newSchema)