const express = require('express');
const router = express();
const {check} = require('express-validator');
const {signup,signin,signout,isEmailExists,isPasswordConfirmed, isSignedIn} = require('../controllers/auth');

//write routes
router.post('/signin',signin);
router.post('/signup',
check('name').isLength({min:3}).withMessage('Name should at least 3 characters'),
check('email').isEmail(),
check('password').isLength({min:5}).withMessage('Password should at least 5 characters'),
isEmailExists,
isPasswordConfirmed,
signup);

//read routes
router.get('/signout',isSignedIn,signout);

module.exports = router;