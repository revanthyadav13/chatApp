const express = require('express');

const chatController = require('../controllers/chat');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/send-message', userAuthentication.authenticate, chatController.postRequestSendMessage);
router.get('/fetch-username', userAuthentication.authenticate, chatController.getRequestFetchUserName);
router.get('/fetch-message', userAuthentication.authenticate, chatController.getRequestFetchMessage);
router.get('/logout', userAuthentication.authenticate, chatController.getRequestLogOut);
router.get('/fetch-username', userAuthentication.authenticate, chatController.getRequestFetchUserName);
router.get('/fetch-users', userAuthentication.authenticate, chatController.getRequestFetchUsers);
module.exports = router;