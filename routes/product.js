const express = require('express');
const router = express.Router();
const {getProductById,createProduct,getAllProducts,getPhoto,getProduct,updateProduct,deleteProduct} = require('../controllers/product');
const {isSignedIn,isAuthenticate,isAdmin} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');


//params
router.param('productId',getProductById);
router.param('userId',getUserById);

//create
router.post('/create/product/:userId',isSignedIn,isAuthenticate,isAdmin,createProduct);

//read
router.get('/product/:productId',getProduct);
router.get('/products',getAllProducts);
router.get('/product/photo/:productId',getPhoto);

//update
 router.put('/product/:productId/:userId',isSignedIn,isAuthenticate,isAdmin,updateProduct);

//delete
 router.delete('/product/:productId/:userId',isSignedIn,isAuthenticate,isAdmin,deleteProduct);

 module.exports = router;