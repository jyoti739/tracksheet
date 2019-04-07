const express = require('express')
const router  = express.Router()
const mongoose = require('mongoose')
const Data_demo_1 = require('../model/data_demo_1')
const user = require('../model/users')

let data_demo;

router.get('/', (req, res)=>{
  Data_demo_1.find().exec().then(result => res.status(200).json(result)) 
    .catch(err => res.status(500).json(err))
})

// get by data id
router.get('/:id', (req, res) =>{
  const _id = req.params.id
  Data_demo_1.findById({_id}).exec().then(result => res.json(result)).catch(err => res.json(err))
})

//get data by date
router.post('/data', (req, res)=>{
  const date = req.body.date
  Data_demo_1.find({date}).then(data => {
    if(data){
      res.json({data})
    }else res.send("No data found matching to this date")
  })
})
//post a data
router.post('/date', (req, res) =>{
  const _id  = new mongoose.Types.ObjectId()
  const {date, data, descriptions} = req.body
  data_demo = new Data_demo_1({_id, date, activity : data, descriptions, user : user._id})
  data_demo.save().then(result => res.json(result))
    .catch(err => res.json(err))
})

//edit a user data
router.put('/', (req, res) =>{
  const _id = req.body.id
  const edit_operations  = {}
  for(const ops of req.body){
    edit_operations[ops.key] = ops.edited_value
  }
  Data_demo_1.update({_id}, {$set : edit_operations}).exec().then(result => res.json(result)).catch(err)
})

//delete to a data
router.delete('/:id', (req, res) =>{
  const _id = req.params.id
  Data_demo_1.remove({_id}).exec()
    .then(result => res.json(result))
    .catch(err => res.json(err))
}) 

module.exports = router