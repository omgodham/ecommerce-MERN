const mongoose = require("mongoose");
const crypto =require('crypto');
const {v4} = require('uuid');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  salt:String,
  encryPassword:{
    type:String,
    required:true
    },
   orders:[
    {
      _id:{
      type:mongoose.ObjectId,
      ref:'Order'
    }
  }  
  ],
   role:{
       type:Number,
       default:0
   },
   cart:[{
       product:mongoose.ObjectId,
       quantity:{
         type:Number,
         default:1
       }
     }]
},{timestamps:true});


userSchema.virtual("password")
.set(function(password) {
        this.salt = v4();
        this.encryPassword = this.securePassword(password);
  });

userSchema.methods = {

    authenticate : function(plainpassword){
        return this.encryPassword === this.securePassword(plainpassword);
    },
    
    securePassword : function(plainpassword){
        if(plainpassword){
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        }else{
            return '';
        }
       
    }
}
module.exports = mongoose.model('User',userSchema);