const mongoose = require("mongoose");

const cartproductSchema = new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:'Product'
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    }
},{timestamps:true})
const cartproduct = mongoose.model('Order',cartproductSchema);
const orderSchema = new mongoose.Schema({
 products:{
     type:Array,
     default:[cartproductSchema]
 } ,
 amount:{
     type:Number,
     required:true
 },
 transaction_id:{
     type:String,
     required:true
 },
 status:{
    type:String,
    default:'Received',
    ennum:['Shipped','Received','Processing','Cancelled','Deliverd']
},
user:{
    type:ObjectId,
    red:'User'
},
address:{
    type:String,
    required:true
}
},{timestamps:true});


const order = mongoose.model('Order',orderSchema);
module.exports = {cartproduct,order}