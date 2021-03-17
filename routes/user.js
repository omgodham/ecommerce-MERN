const express = require('express');
const router = express.Router();
const {getUserById,getUser,updateUser,getProductInCart,getProductInCartById,deleteAllProductsFormCart,createCart,getUserCart,updateProductInCart,deleteProdctFromCart} = require('../controllers/user');
const {isSignedIn,isAuthenticate} = require("../controllers/auth");

//params routes
router.param('userId',getUserById);
router.param('productId',getProductInCartById);

//write routes
router.post('/user/cart/:userId',isSignedIn,isAuthenticate,createCart);

//Read Routes
router.get('/user/:userId',getUser);
router.get('/user/cart/:userId',isSignedIn,isAuthenticate,getUserCart);
router.get('/user/cart/:productId/:userId',isSignedIn,isAuthenticate,getProductInCart);


//Update Router
router.put('/user/:userId',isSignedIn,isAuthenticate,updateUser);
router.put('/user/cart/:productId/:userId',isSignedIn,isAuthenticate,updateProductInCart);
//updating means just deleting for these following routes
router.put('/user/cart/delete/:productId/:userId',isSignedIn,isAuthenticate,deleteProdctFromCart);
router.put('/user/cart/:userId',isSignedIn,isAuthenticate,deleteAllProductsFormCart);

module.exports = router;