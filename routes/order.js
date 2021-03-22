const express = require('express');
const router = express.Router();

const {isSignedIn,isAuthenticate,isAdmin} = require('../controllers/auth');
const {updateStock} = require('../controllers/product');
const {getUserById} = require('../controllers/user');
const {getOrderById,getOrder,getAllOrders,createOrder,updateStatus,getOrdersByUserId} = require('../controllers/order');

//params
router.param('orderId',getOrderById);
router.param('userId',getUserById);

//create
router.post('/create/order/:userId',isSignedIn,isAuthenticate,updateStock,createOrder);

//read
router.get('/order/:orderId/:userId',isSignedIn,isAuthenticate,getOrder);
router.get('/orders/:userId',isSignedIn,isAuthenticate,isAdmin,getAllOrders);
router.get('/orders/user/:userId',isSignedIn,isAuthenticate,getOrdersByUserId);

//update
router.put('/order/:orderId/:userId',isSignedIn,isAuthenticate,updateStatus);


module.exports = router;