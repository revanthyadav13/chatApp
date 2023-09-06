const express = require('express');

const groupController = require('../controllers/group');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/create-group', userAuthentication.authenticate, groupController.postRequestCreateGroup);
router.get('/userGroups', userAuthentication.authenticate, groupController.getRequestUserGroups);
router.get('/messages/:groupId', userAuthentication.authenticate, groupController.getRequestGroupMessages);
router.post('/send-message', userAuthentication.authenticate, groupController.postRequestSendMessage);
router.get('/members/:groupId', userAuthentication.authenticate, groupController.getRequestGroupMembers);
router.delete('/remove-member/:groupId/:userId', userAuthentication.authenticate, groupController.removeMember);
router.put('/make-admin/:groupId/:userId', userAuthentication.authenticate, groupController.makeAdmin);
router.put('/dismiss-admin/:groupId/:userId', userAuthentication.authenticate, groupController.dismissAdmin);
module.exports = router;