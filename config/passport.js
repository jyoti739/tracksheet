const JwtStrategy  = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('users')
const keys = require('./keys')

const opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwtPayload, done)=>{
    console.log(jwtPayload)
    User.findById(jwtPayload.id).then(user =>{
      if(user) return done(null, user)
      return(null, false)
    }).catch(err => console.log(err))
  }))
}