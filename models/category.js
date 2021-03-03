const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  main:{
    type:Boolean,
    default:false
  }
},{timestamps:true});

module.exports = mongoose.model('Category',categorySchema);