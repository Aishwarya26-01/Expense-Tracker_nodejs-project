const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/signup', userController.addUser);
router.get('/get-users', userController.getUser);

module.exports = router;