const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports =  validateInputRegister = data =>{
  const errors  = {}
  data.firstName = !isEmpty(data.firstName) ? data.firstName : ""
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '' 
  data.email = !isEmpty(data.email) ? data.email : ""
  data.password = !isEmpty(data.password) ? data.password : ""
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : ''
  const name = data.firstName + " " + data.lastName
  if(!Validator.isLength(name, {min : 4, max : 30})){
    errors.name = "Name must be between 4 and 30 characters!"
  }
  if(Validator.isEmpty(data.firstName)){
    errors.firstName = "firstName is required"
  }
  if(Validator.isEmpty(data.lastName)){
    errors.lastName = "lastName is reqired"
  }
  if(!Validator.isEmail(data.email)){
    errors.email = "email is invalid!"
  }
  if(Validator.isEmpty(data.email)){
    errors.email = "email field is required!"
  }
 
  // check the password is between min 6 and 30 max
  if(!Validator.isLength(data.password, {min : 6, max : 30})){
    errors.password = 'password must be atleast 6 characters!'
  }
  if(Validator.isEmpty(data.password)){
    errors.password = "password is requried!"
  }
  // check the password and confirm password is equal
  if(!Validator.equals(data.password, data.confirmPassword)){
    errors.confirmPassword = "password must match!"
  }
    // check isEmpty for confirm password field
  if(Validator.isEmpty(data.confirmPassword)){
    errors.confirmPassword = "confirm password field is requried!"
  }
  return{
    errors,
    isValid : isEmpty(errors)
  }
}