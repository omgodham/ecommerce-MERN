const {Order} = require('../models/order');
const User = require('../models/user');

//get order by id param
exports.getOrderById = (req,res,next,id) => {
Order.findById(id)
.populate('user')
.exec((err,order) =>{
if(err){
    return res.status(400).json({
        error:'No order of this id'
    });
}
    req.order = order;
    next();
});
}


//create order
exports.createOrder = (req,res) =>{
    const order = new Order(req.body);
    order.save((err,order)=>{
        if(err || !order){
            return res.status(400).json({
                  error:'order cannot be create' 
              });
          }
          User.findById(req.profile._id,(err,user)=>{
            if(!err) user.orders.push(order._id);
            else console.log(err);
            user.save();
        }); 
          res.status(200).json(order);
    });   
    }

//get order by id
exports.getOrder = (req,res) => {
    Order.findOne({_id:req.order._id})
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:'there is no order of this id'
            })
        }
        order.products.map(currentProduct =>{
            currentProduct.product.photo = undefined;
        });
        res.status(200).json(order);
    });
  }

  //get all orders
  exports.getAllOrders = (req,res) => {
    Order.find({},(err,orders)=>{
        if(err){
            return res.status(400).json({
                error:'failed to get all orders'
            })
        }
        res.status(200).json(orders);
    });
  }

  //update order
  exports.updateStatus = (req,res) =>{
    Order.findByIdAndUpdate(req.order._id,
        {$set:{status:req.body.status}},
        {new:true,useFindAndModify:false},
        (err,updatedOrder)=>{
        if(err || !updatedOrder){
          return res.status(400).json({
                error:'order not found for updation' 
            });
        }
        res.status(200).json(updatedOrder);
    });
}

exports.getOrdersByUserId = (req,res) => {
    const {userId} = req.body;
    Order.find({user:userId})
    .exec((err,orders)=>{
        if(err){
            return res.status(400).json({
                error:'there is no orders for this user'
            })
        }
        res.status(200).json(orders);
    });
}