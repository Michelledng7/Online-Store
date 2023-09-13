const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');

router.route('/').post(loginLimiter, authController.login);

router.route('/logout').post(authController.logout);

router.route('/refresh').get(authController.refresh);

module.exports = router;
