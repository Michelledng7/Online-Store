const User = require('../models/User');
const Ticket = require('../models/Ticket');

const asyncHandler = require('express-async-handler'); //keep us from using too many try/catch blocks
const bcrypt = require('bcrypt');

//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {});

//@desc Create a new user
//@route POST /users
//@access Private
const createNewUser = asyncHandler(async (req, res) => {});

//@desc Update a user
//@route PATCH /users
//@access Private
const updateUser = asyncHandler(async (req, res) => {});

//@desc delete a user
//@route DELETE /users
//@access Private
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
};
