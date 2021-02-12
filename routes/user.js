const express = require('express');
const router = express.Router();
const {getUserById,getUser,createUser} = require('../controllers/user');

router.param('userId',getUserById);

//Read Routes
router.get('/user/:userId',getUser);

//Writer Router
router.post('/create/user',createUser);

module.exports = router;