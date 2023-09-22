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
		return res.status(401).json({ message: 'UnauthorizedU' });
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

		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: '7d' }
	);

	const refreshToken = jwt.sign(
		{
			username: foundUser.username,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: '7d' }
	);
	//create secure cookie with refresh token
	res.cookie('jwt', refreshToken, {
		httpOnly: true, //only web server can access
		secure: true, //https only
		sameSite: 'none', //cross-site cookies
		maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry 7 days
	});
	// Send accessToken containing username and roles
	res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public because access token has expired
const refresh = asyncHandler(async (req, res) => {
	const cookies = req.cookies;
	if (!cookies.jwt) {
		return res.status(401).json({ message: 'UnauthorizedCookies' });
	}
	const refreshToken = cookies.jwt;
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		asyncHandler(async (err, decoded) => {
			if (err) {
				return res.status(403).json({ message: 'Forbidden' });
			}
			const foundUser = User.findOne({ username: decoded.username }).exec();
			if (!foundUser) {
				return res.status(401).json({ message: 'Unauthorized-no user' });
			}
			const accessToken = jwt.sign(
				{
					UserInfo: {
						username: foundUser.username,
						roles: foundUser.roles,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '7d' }
			);
			res.json({ accessToken });
		})
	);
});

// @desc Logout
// @route POST /auth/logout
// @access Private
const logout = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies.jwt) return res.sendStatus(204); //no content in cookies
	res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
	res.json({ message: 'Cookie cleared' });
};

module.exports = { login, refresh, logout };
