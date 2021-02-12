const User = require('../models/user');

 exports.getUserById = (req,res,next,id) => {
  User.findById(id,(err,user)=>{
      if(err){
          return res.status(400).json({
              error:'there is no user of this id'
          })
      }
      req.profile = user;
      next();
  });
}


exports.getUser = (req,res) => {
    User.findOne({_id:req.profile._id},(err,user)=>{
        if(err){
            return res.status(400).json({
                error:'there is no user of this id'
            })
        }
        user.encryPassword=undefined;
        res.status(200).json(user);
    });
  }

exports.createUser = (req,res) =>{
    const user = new User(req.body);
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                error:'cannot create user'
            })
        }
        res.status(200).json(user);
    });
}
