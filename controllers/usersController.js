const User = require('../models/User')
const Ticket = require('../models/Ticket')
const asyncHandler = require('express-async-handler') //keep us from using too many try/catch blocks
const bcrypt = require('bcrypt')

//@desc Get all users
//@route GET /users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find().select('-password').lean() //only get json data, not the password
	if (!users.length) {
		return res.status(404).json({ message: 'no users found' })
	}
	res.json(users)
})

//@desc Create a new user
//@route POST /users
//@access Private
const createNewUser = asyncHandler(async (req, res) => {
	const { username, password, roles } = req.body
	// confirm data is valid
	if (!username || !password) {
		return res.status(400).json({ message: 'All fields are required' })
	}
	// check for duplicate, don't want users with same name
	const duplicate = await User.findOne({ username })
		.collation({ locale: 'en', strength: 2 })
		.lean()
		.exec()
	if (duplicate) {
		return res.status(409).json({ message: 'Duplicate username' })
	}
	// hash password
	const hashedPassword = await bcrypt.hash(password, 10) //salt rounds hashed pwd in db
	const userObject =
		!Array.isArray(roles) || !roles.length
			? { username, password: hashedPassword }
			: { username, password: hashedPassword, roles } //received username from req

	// create and store new user
	const user = await User.create(userObject)
	if (user) {
		//created
		res.status(201).json({ message: `New user ${username} created` })
	} else {
		res.status(400).json({ message: 'Invalid user data received' })
	}
})

//@desc Update a user
//@route PATCH /users
//@access Private
const updateUser = asyncHandler(async (req, res) => {
	const { username, password, roles, id, active } = req.body
	//confirm data
	if (
		!username ||
		!password ||
		!Array.isArray(roles) ||
		!roles.length ||
		!id ||
		typeof active != 'boolean'
	) {
		return res.status(400).json({ message: 'All fields are required' })
	}
	const user = await User.findById(id).exec() //no need lean(), save method attached to it
	if (!user) {
		return res.status(400).json({ message: 'User not found' })
	}
	//check for duplicate
	const duplicate = await User.findOne({ username })
		.collation({ locale: 'en', strength: 2 })
		.lean()
		.exec() //don't need method return with this
	//Allow updates to the original user
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: 'Duplicate username' })
	}

	user.username = username //latter is updated
	user.roles = roles
	user.active = active

	if (password) {
		user.password = await bcrypt.hash(password, 10)
	}

	const updatedUser = await user.save()
	res.json({ message: `${updatedUser.username} updated` })
})

//@desc delete a user
//@route DELETE /users
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.body
	if (!id) {
		return res.status(400).json({ message: 'No user id provided' })
	}

	const ticket = await Ticket.findOne({ user: id }).lean().exec()
	if (ticket) {
		return res.status(400).json({ message: 'User has tickets assigned' })
	}

	const deleteUser = await User.findById(id).exec()
	if (!deleteUser) {
		return res.status(400).json({ message: 'User not Found' })
	}
	const result = await deleteUser.deleteOne()

	res.status(200).json({
		message: `User ${result.username} with id ${result._id} deleted`,
	})
})

module.exports = {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
}
