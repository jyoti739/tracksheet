const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// from model
const Profile = require('../model/profiles')
const Users = require('../model/users')

router.get('/', (req, res) =>{
  res.json({msg : "profile router created!"})
})

// @route GET profile/api/test
// @desc 
// access private
router.get('/test', passport.authenticate('jwt', {session : false}), (req, res)=>{
   Profile.findOne({user : req.user.id})
    .populate('user', ['firstName', 'lastName'])  // populate() allows you to the populate the user fields from profile
    .then(profile =>{
      if(!profile) return res.status(404).json({noProfileFoundError : "No profile found error!"})
      return res.json(profile)
    }).catch(err => res.status(404).json({errors : err}))
})

//@route GET profile/handle/:handle
//@desc Create or edit user profile
//@access Public
router.get('/handle/:handle', (req, res)=>{
  const  errors  = {}
  Profile.findOne({handle : req.params.handle})
    .populate('user', ['firstName', 'lastName'])
    .then(profile =>{
      if(!profile){
        errors.noProfile = 'There is no profile for this User'
        res.status(404).json(errors)
      }
      res.json(profile)
    }).catch(err => res.status(404).json(err))
})
//@route GET profile/user/user_id
//@desc Get profile by user id 
//@access Public
router.get('/user/:user_id', (req, res) => {
  const errors = {}
  Profile.findOne({user : req.params.user_id})
    .populate('user', ['firstName', 'lastName'])
    .then(profile =>{
      if(!profile){
        errors.noProfile = 'no profile for this User'
        res.status(404).json(errors)
       }
      res.json(profile)
    }).catch(err => res.status(500).json(err))
})

//@route GET api/profile/all
//@desc Get all profiles
//@access Public
router.get('/all', (req, res) =>{
  const errors = {}
  Profile.find().populate('user', ['firstName', 'lastName'])
    .then(profiles =>{
      errors.noProfile = 'There are no profiles found!'
      if(!profiles) res.json(errors)
      res.json(profiles)
    }).catch(err => res.json({profilesError : "There are no profiles!"}))
}) 
//@route POST
//@desc  update a profile,
//TODO : Router for this should be changed to /update_profile
//@access private
//-----------------------------------------------------------------------------------------------------
// router.post('/update_profile', passport.authenticate('jwt', {session : false}), (req, res) =>{
//   // get fields 
//   const profileFields = {}
//   profileFields.user = req.user.id
//   if(req.body.handle) profileFields.handle = req.body.handle
//   if(req.body.date) profileFields.date = req.body.date
//   if(typeof req.body.platforms !== 'undefined'){
//     profileFields.platforms = req.body.platforms.split(',')
//   }
//   if(typeof req.body.application !== 'undefined'){
//     profileFields.application = req.body.application.split(',')
//   }
//   if(req.body.application) profileFields.descriptions = req.body.descriptions
//   if(req.body.others) profileFields.others = req.body.others

//   Profile.findOne({user : req.user.id})
//     .populate('user', 'firstName').exec() 
//     .then(profile => {
//       if(profile){
//       // Update 
//       Profile.findOneAndUpdate({user : req.user.id}, {$set : profileFields}, {new : true})
//       .then(profile => res.json(profile))
//     }else{
//       // create a profile, if profile does not exist
      
      
//       // //check if handle exists
//       // Profile.findOne({handle : profileFields.handle}).then(profile =>{
//       //   if(profile){
//       //     // errors.handle   = "That handle already exists"
//       //     res.status(400).json({error_message : "errors will be displayed once it is done!"})
//       //   }
//       //   // save profile
//       //   new Profile(profileFields).save().then(profile => res.status(201).json(profile)) 
//       // })
//     } 
//   })
// })
//----------------------------------------------------------------

//@route POST
//@desc  create a profile,
// TODO : Router for this should be changed to /create_profile
//@access private
router.post('/create_profile', passport.authenticate('jwt', {session : false}), (req, res)=>{
  const profileFields = {}
  profileFields.user = req.user.id
  //
  console.log(req.user.id)
  if(req.body.handle) profileFields.handle = req.body.handle
  if(req.body.date) profileFields.date = req.body.date
  if(req.body.hours) profileFields.hours = req.body.hours
  if(typeof req.body.platforms !== 'undefined'){
    profileFields.platforms = req.body.platforms
  }   
  if(typeof req.body.application !== 'undefined'){
    profileFields.application  = req.body.application
  }
  if(req.body.others) profileFields.others = req.body.others
  if(req.body.descriptions) profileFields.descriptions = req.body.descriptions
  Profile.findOne({user : req.user.id}).populate('user', 'firstName').exec()
    .then(profile =>{
      // save the profile
      new Profile(profileFields).save().then(profile => res.status(201).json(profile))
    }).catch(err => res.status(503).json({error_on_creating_profile : err}))
})

// get all the profiles for a particular User
router.get("/handles/:handle", (req, res) =>{
  const handle = req.params.handle 
  const noHandleErrors = {}
  Profile.findOne({handle}).then(profiles =>{
    if(!handle){
      noHandleErrors.errors = "There is no such handle presents!"
      res.status(404).json(noHandleErrors)
    }return res.json({all_profiles_By_this_handle : profiles})
  })
})


//get all profiles by user
router.get('/all1', passport.authenticate('jwt', {session : false}), (req, res) =>{
  const id = req.user.id
  const errors = {}
  const profileObj = {}
  let jyoti = []
  Profile.find().populate('user', ['firstName', 'lastName'])
    .then(profiles =>{
      errors.noProfile = 'There are no profiles found!'
      if(!profiles) res.json(errors)
      profiles.map(profile => {
        console.log(typeof id, "===", typeof JSON.stringify(profile.user._id))
        profile.user._id == id ? 
          // console.log(profile) 
          jyoti.push(profile) 
         : ""
      })
      res.json({jyoti})
    }).catch(err => res.json({profilesError : "There are no profiles!"}))
}) 

module.exports = router