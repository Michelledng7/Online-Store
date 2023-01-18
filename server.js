const express = require('express');
const app = express();
const PORT = process.env.PORT || 5500;
const path = require('path');
const cookieParser = require('cookie-parser');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

app.use(logger);
app.use(cookieParser());
app.use(express.json()); // handle json
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/root'));

app.all('*', (req, res) => {
	res.status(404);

	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({ message: '404 Not Found' });
	} else {
		res.type('txt').send('404 Not Found');
	}
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(path);
	console.log(__dirname);
});
