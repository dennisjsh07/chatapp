const express = require('express');
const userController = require('../controller/user');

const router = express.Router();

router.post('/add-user',userController.addUser);

router.post('/login',userController.userLogin);

module.exports = router;
 