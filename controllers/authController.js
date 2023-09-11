const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: 'All fields required' });
	}
	const foundUser = await User.findOne({ username }).exec();
	if (!foundUser || !foundUser.active) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	const match = await bcrypt.compare(password, foundUser.password);
	if (!match) {
		return res.status(401).json({ message: 'Password not match' });
	}

	const accessToken = jwt.sign(
		{
			UserInfo: {
				username: foundUser.username,
				roles: foundUser.roles,
			},
		},
		process.env.ACCESS_TOKES_SECRET,
		{ expiresIn: '10s' }
	);

	const refreshToken = jwt.sign(
		{
			username: foundUser.username,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: '1d' }
	);
	//create secure cookie with refresh token
	res.cookie('jwt', refreshToken, {
		httpOnly: true, //only web server can access
		secure: true, //https only
		sameSite: 'none', //cross-site cookies
		maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry 7 days
	});
	res.json({ accessToken });
});

// @desc Logout
// @route POST /auth/logout
// @access Private
const logout = asyncHandler(async (req, res) => {});

// @desc Refresh
// @route GET /auth/refresh
// @access Private
const refresh = asyncHandler(async (req, res) => {});
