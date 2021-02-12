const express = require('express');
const router = express.Router();
const {getUserById,getUser,updateUser} = require('../controllers/user');


//params routes
router.param('userId',getUserById);

//Read Routes
router.get('/user/:userId',getUser);

//Update Router
router.put('/user/:userId',updateUser);

module.exports = router;