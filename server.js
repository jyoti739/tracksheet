const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const body_parser = require('body-parser')
const usersRoute = require('./route/users')
const demoDataRoute = require('./route/data_demo_1')
const profileRoute = require('./route/profiles')
const keys = require('./config/keys').mongoDBUri

//core module
const path = require('path')

//delete the route, once test is done
const user_1Route = require('./route/users_1')

// const db = keys.mongoDBUri
mongoose.connect(keys, {useNewUrlParser : true}).then(_ => console.log("mongodb connected!")).catch(err => console.log(err))

//Passport Middleware
app.use(passport.initialize())

//passport config
require('./config/passport')(passport)



//cors handling should be here before any routes
app.use((req, res, next) =>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 'Origin, X-Requseted-With, Content-type, Accept, Authorization')
  if(req.method === "OPTIONS"){
      res.header("Access-Control-Allow-methods", "GET, PUT, PATCH, POST, DELETE")
      res.status(200).json({message_from_use_middleware : "OK" })
  }
  next()
})
app.use(body_parser.urlencoded({extended : false}))
app.use(body_parser.json())
app.use('/api', usersRoute)
app.use('/data', demoDataRoute)
app.use('/profile/api', profileRoute)

// just to check for users route, will delete once the test is done 
app.use('/userTest', user_1Route)

// Serve static assets if it is in production
if(process.env.NODE_ENV === 'production'){
  // set static folder 
  app.use(express.static('client/build'))
  // 
  app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


const port  = 5000 || process.env.PORT
app.listen(port, ()=>console.log("app is listening on port ", port))
