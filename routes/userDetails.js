const express = require('express');

const userDetailsController = require('../controllers/userDetails');

const router = express.Router();

router.post('/signup', userDetailsController.postRequestSignup);
router.post('/login', userDetailsController.postRequestLogin);

module.exports = router;