const express = require('express');
const chatController = require('../controller/chat');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/send-message', userAuthentication.authenticate, chatController.addNewChat);

router.get('/get-message', userAuthentication.authenticate, chatController.getAllChat);

router.post('/uploadFile', userAuthentication.authenticate, chatController.uploadFile);

router.post('/addUserToGroup', userAuthentication.authenticate, chatController.addUserToGroup);

router.get('/getUsersofGroup', chatController.getUsersofGroup);

router.put('/makenewAdmin', userAuthentication.authenticate, chatController.makenewAdmin);

router.delete('/deleteUserFromGroup', userAuthentication.authenticate, chatController.deleteUserFromGroup);

module.exports = router;

  

