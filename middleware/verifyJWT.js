//verify each request with the auth
const jwt = require('jsonwebtoken');

//middleware with next
const verifyJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader?.startsWith('Bearer ')) {
		console.log('no auth header');
		return res.status(401).json({ message: 'UnauthorizedM' });
	}
	const token = authHeader.split(' ')[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.status(403).json({ message: 'Verify Not authorized' });
		req.user = decoded.UserInfo.username;
		req.roles = decoded.UserInfo.roles;
		next();
	});
};
module.exports = verifyJWT;
