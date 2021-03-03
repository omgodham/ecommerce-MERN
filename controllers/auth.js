const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {body,validationResult} = require('express-validator');

//signup route (creates account);
exports.signup = (req,res) =>{
    const user = new User(req.body);
    const {errors} = validationResult(req);
    
    if(!errors.length == 0){
        return res.json({
            error:errors[0].msg
        });
    }
    user.save((err,user)=>{
        if(err){
            if(err.keyValue.email){
                return res.status(400).json({
                    error:'Email already exists'
                });    
            }
         res.status(400).json({
            error:'cannot save user in db'
        }); 
        }
        res.status(200).json(user);
    })
}

//signin
exports.signin = (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email},(err,user) => {
        if(err || !user){
        return  res.status(400).json({
                error:'Enter the correct email'
            });
        }
        if(!user.authenticate(password)){
          return res.status(400).json({
                error:'Enter correct password'
            })
        }
        var token = jwt.sign({id:user._id}, process.env.SECRET);
        res.cookie('token',token,{ expire : 9999 + Date.now() })
        res.status(200).json({    
            token,
            user
        })
    });
}

//signout 
exports.signout = (req,res) => {
        res.clearCookie('token');
        return res.status(200).json({
            message:'logout successfull'
        });
    }
  
//check for email existance middleware
    exports.isEmailExists = (req,res,next) => {
        body('email').custom(value => { //express custom validator
            console.log(value);
            return User.findUserByEmail(value).then(user => {
                if (user) {
                  return Promise.reject(); //this will give error while saving data to db if email matches
                }
              });     
        });
       next();
    }

//check for confirm password Middleware
    exports.isPasswordConfirmed = (req,res,next) =>{
        if(req.body.password !== req.body.confirm_password){
            return res.json({
                error:'confirm password does not match'
            });
        }
        next();
    }

    //checking for signed in
    exports.isSignedIn = expressJwt({ //this will check for Authorization token in headers
        //while doing api call having this middleware
        secret:process.env.SECRET,
        requestProperty:'auth', //this will set req.auth = { id: '60276cbc593f6b095c49997d', iat: 1613204830 }
        //id of that user who is signed in means his token will be saved in browser  
        algorithms: ['HS256']
    });
    

    //checking for signed in user is making changes only
    exports.isAuthenticate = (req,res,next) =>{
        const checker = req.profile && req.auth && req.profile._id == req.auth.id ;
        if(!checker){
            return res.status(400).json({
                error:'You are not authenticated'
            });
        }
        next();
    }

    //checking for admin
    exports.isAdmin = (req,res,next) =>{
        if(req.profile.role == 0){
            return res.status(400).json({
                error:'You are not admin'
            });
        }
        next();
    }


