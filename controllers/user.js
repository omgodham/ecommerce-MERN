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


  exports.updateUser = (req,res) =>{
    const user = new User(req.body);
    User.findByIdAndUpdate(req.profile._id,
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,updatedUser)=>{
        if(err || !user){
          return res.status(400).json({
                error:'User not found for updation' 
            });
        }
        res.status(200).json(updatedUser);
    });
}

exports.pushOrderInPurchaseList = (req,res,next) =>{
    let order = req.body;
    User.findById(req.profile._id).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                  error:'User not found for pushing order' 
              });
          }
          user.orders.push(order);
          user.save();
    });
    next();
}