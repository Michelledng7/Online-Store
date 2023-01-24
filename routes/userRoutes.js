const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router
	.route('/')
	.get(usersController.getAllUsers)
	.post(usersController.createNewUser)
	.patch(usersController.updateUser)
	.delete(usersController.deleteUser); //when front calls for /users, it'll call these methods

module.exports = router;
