const express = require('express');
const router = express.Router();
const {createSession} = require('../controllers/stripe');
router.post('/create-checkout-session',createSession);

module.exports = router;