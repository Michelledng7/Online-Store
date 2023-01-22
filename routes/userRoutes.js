const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createNewUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser); //when front calls for /users, it'll call these methods

module.exports = router;
