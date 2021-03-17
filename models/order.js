const mongoose = require("mongoose");

const cartproductSchema = new mongoose.Schema({
    product:{
        type:mongoose.ObjectId,
        ref:'Product'
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    }
},{timestamps:true})
const cartProduct = mongoose.model('cartProduct',cartproductSchema);

const orderSchema = new mongoose.Schema({
 products:[cartproductSchema],
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
    type:mongoose.ObjectId,
    red:'User'
},
address:{
    type:String
}
},{timestamps:true});

const Order = mongoose.model('Order',orderSchema);

module.exports = {cartProduct,Order}