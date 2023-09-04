const express = require('express');

const groupController = require('../controllers/group');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/create-group', userAuthentication.authenticate, groupController.postRequestCreateGroup);
router.get('/userGroups', userAuthentication.authenticate, groupController.getRequestUserGroups);
router.get('/messages/:groupId', userAuthentication.authenticate, groupController.getRequestGroupMessages);
router.post('/send-message', userAuthentication.authenticate, groupController.postRequestSendMessage);

module.exports = router;