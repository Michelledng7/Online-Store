const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

router.route('/').get().post().patch().delete(); //when front calls for /users, it'll call these methods

module.exports = router;
