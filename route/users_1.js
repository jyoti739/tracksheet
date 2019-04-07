const express = require('express')
const router = express.Router()
const Users = require('../model/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const passport  = require('passport')

//register Input validation
const validateRegisterInput = require('../validation/register')
//login input validation
const validateLoginInput = require('../validation/login')

router.get('/', (req, res)=>{
  // res.json({tested : "user_1 is tested."})
  Users.find().exec().then(result => res.json(result))
})

// router.get('/:id', (req, res)=>{
//   const _id = req.params.id
//   Users.findById({_id}).exec().then(result => res.json({user : result}))
// })

//register 
router.post('/register', (req, res)=>{
  const {errors, isValid } = validateRegisterInput(req.body)
  const {firstName, lastName, email, password, confirmPassword} = req.body

  // check validation
  if(!isValid) {
    console.log("this")
    return res.status(400).json(errors)
  }
  Users.findOne({email}).then(user =>{
    if(user){
      res.json({exist : "user already present in dB"})
    }else{
      const users = new Users({email, firstName, lastName, password, confirmPassword})
      bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(users.password, salt, (err, hash)=>{
          if(err) console.log(err)
          users.password = hash
          users.save().then(user => res.json({userSalted : user})).catch(err => res.json({saltedError : err}))
        })
      })
    }
  }).catch(err => console.log(err))
})

// login 
//@access private 
router.post('/login', (req, res)=>{
  const {errors, isValid} = validateLoginInput(req.body)
  const {email, password} = req.body
  // check validation
  if(!isValid){
    return res.status(400).json(errors)
  }
  Users.findOne({email}).then(user=>{
    if(user){
      bcrypt.compare(password, user.password).then(isMatch=>{
        if(isMatch){
          const {firstName, lastName, password}  = user
          const payload = {id : user._id, firstName, lastName, password}
          jwt.sign(payload, keys.secretOrKey, {expiresIn : '1h'}, (err, token)=>{
            res.json({
              success : true,
              token : "Bearer " + token
            })
          })
        }else{
          res.json({password : "password incorrect."})
        }
      })
    }else {res.status(404).json({email : "User not found!"})}
  })
})

//GET
//@access private
router.get('/privateC', passport.authenticate('jwt', {session : false}), (req, res) =>{
  // res.json({current_msg : "success"})
  res.json({user : req.user})
}) 

module.exports = router