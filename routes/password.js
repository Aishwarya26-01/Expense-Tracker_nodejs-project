const express = require('express');

const passwordController = require('../controllers/password');

const router = express.Router();

router.post('/forgotpassword', passwordController.forgotPassword);
router.get('/resetpassword/:id', passwordController.resetPassword);
router.get('/updatepassword/:resetpasswordid', passwordController.updatePassword);

module.exports = router;