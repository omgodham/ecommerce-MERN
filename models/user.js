const mongoose = require("mongoose");
const crypto =require('crypto');
import { v4 as uuidv4 } from 'uuid';
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  encryPassword:{
    type:String,
    required:true
    },
   orders:{
    type:Array,
    default:[]   
   },
   role:{
       type:Number,
       default:0
   }
},{timestamps:true});


userSchema.virtual('password')
.set(function(password) {
        this.salt = uuidv4(),
        this.encryPassword = securePassword(password)
  });

userSchema.methods = {
    authinticate : function(plainpassword){
        return this.encryPassword == this.securePassword(plainpassword);
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
