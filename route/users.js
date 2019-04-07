const express = require('express')
const router = express.Router()
const Users = require('../model/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys').secretOrKey
const passport = require('passport')

let users;
router.get('/', (req, res)=>{
  // res.send("luckie")
  Users.find().exec().then(result => res.json(result)).catch(err => res.json(err))
})


router.get('/:id', (req, res) =>{
  const _id = req.params.id
  Users.findById(_id).exec().then(user => res.json(user)).catch(err => res.status(500).json({"error" : err}))

})
router.post('/', (req, res) =>{
  const { email, firstName, lastName, password } =  req.body
  users = new Users({
    email,
    firstName,
    lastName,
    password
  })
  // res.status(200).json(users)
  users.save().then(result => console.log("user is added to database!")).catch(err=>res.json(errs))
})


router.post('/register', (req, res) =>{
  const { email, firstName, lastName, password } =  req.body
  Users.findOne({email}).then(user =>{
    if(user){
      res.json({message : "user already exists!"})
    }else{
     users =  new Users({email, firstName, lastName, password})
     console.log("this is salted!,", bcrypt)
     const salt = bcrypt.genSaltSync(10)
     const passwordHash = bcrypt.hashSync(users.password, salt)
     console.log("yheo", salt, passwordHash)
     users.password = passwordHash
     users.save().then(user => res.send('user is registered!')).catch(err => res.send(err)) 
    //  bcrypt.genSalt(1, sal t, (err, salt) =>{   // not working for async function IDK why, need to check
    //   console.log("kfldsfjlsdfkjslfjldsjflsdjlsdjglsdjg")
    //    bcrypt.hash(users.password, salt, (err, hash) =>{
    //      if(err) console.log(err)
    //      users.password = hash
    //      users.save().then(user => res.json({user : user})).catch(err => res.json({error_message :err}))
    //    })
    //  })
    }
  }).catch(err => res.send(err))
})

router.post('/login', (req, res) =>{
  const {email, password} = req.body
  Users.findOne({email}).then(user =>{
    const payload = {firstName : user.firstName, lastName : user.lastName, password : user.password, normal_password : password}
    
    if(user){
      bcrypt.compare(password, user.password).then(isMatch =>{
        if(!isMatch){
          res.json({failed : "password is incorrect!"})
        }
        //==============================================================================================
        jwt.sign(payload, keys, {expiresIn : '1h'}, async function(err, token){
          console.log("password ", password)
          if(token){
            const dfi = await jwt.verify(token, keys)
            // console.log("verify  ", dfi)
            // res.json(token)
            res.json({
              "token" : token,
              user : {
                "first name" : dfi.firstName,
                "last name" :  dfi.lastName,
                "email" : email,
                "password" : dfi.password,
                "normal_password" : password
              }
            }).catch(err => res.json({token_error : err}))
          }else throw err
        })
        //=================================================================================================
      }).catch(err => res.json({compare_error : err}))
    }
  })
})
//get the current user who's just logged in 
// trying to making it as a private router by making add token in the authourization header
router.post('/current', (req, res)=>{
  const token = req.headers
  const auth  = token['authorization']
  jwt.verify(auth, keys, function(err, user_decoded){
    if(err) res.json({jwt_error_message : err})
    console.log(user_decoded)
    console.log(auth)
    res.json(
    {message : "able to access current route",
    authorization : token['authorization'],
    firstName : user_decoded.firstName,
    lastName : user_decoded.lastName,
    password : user_decoded.password,
    normal_password : user_decoded.normal_password }
  )
  })
})

// router.post('/get', function(req, res){
//   console.log("get is working fine ")
// })

router.get('/current', passport.authenticate('jwt', {session : false}, (req, res)=>{
  console.log(req.user.firstName)
}))

router.delete('/:id', (req, res) =>{
  const _id = req.params.id
  Users.remove({_id}).exec().then(result => res.json(result))//{message : "User is deleted."}))
    .catch(err => res.json({error : err}))
})

module.exports = router  