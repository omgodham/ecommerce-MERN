const express = require('express');
const router = express();

const {} = require('../controllers/auth');

//write routes
router.post('/signin',signin);
router.post('/signup',signup);

//read routes
router.get('/signout',signout);

module.exports = router;