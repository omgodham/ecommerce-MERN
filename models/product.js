const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
   price:{
    type:Number,
    required: true,   
   },
   category:{
       type:ObjectId,
       ref:'Category',
       required: true,
   },
   stock:{
    type:Number,
    required: true,   
   },
   sold:{
    type:Number   
   },
   photo:{
       data:Buffer,
       ContentType:String,
       required: true,
   }
},{timestamps:true});

module.exports = mongoose.model('Product',productSchema);