const express = require('express');
const category = require('../models/category');
const router = express.Router();

const {getCategoryById,createCategory,getCategory,updateCategory,deleteCategory,getAllCategories} = require('../controllers/category');
const {isSignedIn,isAuthenticate,isAdmin} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');


//params
router.param('categoryId',getCategoryById);
router.param('userId',getUserById);

//create
router.post('/create/category/:userId',isSignedIn,isAuthenticate,isAdmin,createCategory);

//read
router.get('/category/:categoryId',getCategory);
router.get('/categories',getAllCategories);

//update
router.put('/category/:categoryId/:userId',isSignedIn,isAuthenticate,isAdmin,updateCategory);

//delete
router.delete('/category/:categoryId/:userId',isSignedIn,isAuthenticate,isAdmin,deleteCategory);

module.exports = router;