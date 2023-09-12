const express = require('express');

const chatController = require('../controllers/chat');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/fetch-username', userAuthentication.authenticate, chatController.getRequestFetchUserName);
router.get('/logout', userAuthentication.authenticate, chatController.getRequestLogOut);
router.get('/fetch-users', userAuthentication.authenticate, chatController.getRequestFetchUsers);
module.exports = router;