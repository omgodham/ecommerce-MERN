const express = require('express');
const router = express.Router();

const {isSignedIn,isAuthenticate,isAdmin} = require('../controllers/auth');
const {updateStock} = require('../controllers/product');
const {getUserById} = require('../controllers/user');
const {getOrderById,getOrder,getAllOrders,createOrder,updateStatus} = require('../controllers/order');

//params
router.param('orderId',getOrderById);
router.param('userId',getUserById);

//create
router.post('/create/order/:userId',isSignedIn,isAuthenticate,isAdmin,updateStock,createOrder);

//read
router.get('/order/:orderId',getOrder);
router.get('/orders',getAllOrders);

//update
router.put('/order/:orderId/:userId',isSignedIn,isAuthenticate,isAdmin,updateStatus);


module.exports = router;