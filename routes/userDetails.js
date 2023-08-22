const express = require('express');

const userDetailsController = require('../controllers/userDetails');

const router = express.Router();

router.post('/signup', userDetailsController.postRequestSignup);

module.exports = router;