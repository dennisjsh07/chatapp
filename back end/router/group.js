const express = require('express');
const groupController = require('../controller/group');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/add-group', userAuthentication.authenticate, groupController.addGroup);

router.get('/get-group', userAuthentication.authenticate, groupController.getGroup);

module.exports = router;
 