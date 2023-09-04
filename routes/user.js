const express = require('express');

const UserController = require('../controllers/User');

const router = express.Router();

router.post('/signup', UserController.postRequestSignup);
router.post('/login', UserController.postRequestLogin);

module.exports = router;