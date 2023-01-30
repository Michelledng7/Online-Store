const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

router
	.route('/')
	.get(ticketsController.getAllTickets)
	.post(ticketsController.createNewTicket)
	.patch(ticketsController.updateTicket);

module.exports = router;
