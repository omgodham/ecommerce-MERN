const User = require('../models/user');

exports.signin = (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email},(err,user) => {
        if(err || !user){
        return  res.status(400).json({
                error:'Enter the correct email'
            });
        }
        if(!user.authinticate(password)){
          return res.status(400).json({
                error:'Enter correct password'
            })
        }
        res.status(200).json({
            token:'',
            user
        })
    });
}