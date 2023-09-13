const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

const loginLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5, // limit each IP to 5 login attempts per window per minute
	message: {
		message: 'Too many login attempts from this IP, please try 60 seconds',
	},
	handler: (req, res, next, options) => {
		logEvents(
			`Too many login attempts: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
			'error.log'
		);
		res.status(options.statusCode).send(options.message);
	},
	standardHeaders: true,
	legacyHeaders: false,
});

module.exports = loginLimiter;
