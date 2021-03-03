const express = require('express');
const router = express.Router();
const {getUserById,getUser,updateUser,getProductInCart,getProductInCartById,createCart,getUserCart,updateProductInCart,deleteProdctFromCart} = require('../controllers/user');


//params routes
router.param('userId',getUserById);
router.param('productId',getProductInCartById);

//write routes
router.post('/user/cart/:userId',createCart);

//Read Routes
router.get('/user/:userId',getUser);
router.get('/user/cart/:userId',getUserCart);
router.get('/user/cart/:productId/:userId',getProductInCart);


//Update Router
router.put('/user/:userId',updateUser);
router.put('/user/cart/:productId/:userId',updateProductInCart);

// delete router
router.put('/user/cart/delete/:productId/:userId',deleteProdctFromCart);
module.exports = router;