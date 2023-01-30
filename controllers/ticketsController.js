const User = require('../models/User');
const Ticket = require('../models/Ticket');

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

//@desc Get all notes
//@route GET /notes
//@access Private
const getAllTickets = asyncHandler(async (req, res) => {
	const tickets = await Ticket.find().select('-password').lean();
	if (!tickets?.length) {
		return res.status(400).json({ message: 'No tickets avail' });
	}
	res.json(tickets);
});

//@desc Create a new ticket
//@route POST /tickets
//@access Private

const createNewTicket = asyncHandler(async (req, res) => {
	const { title, text, user } = req.body;
	//confirm validate data
	if (!title || !user) {
		return res.status(400).json({ message: 'All fields required' });
	}
	const ticketObject = { title, user };
	//create and store a new ticket
	const ticket = await Ticket.create(ticketObject);
	if (ticket) {
		res.status(200).json({ message: `A new ticket ${ticket._id} created` });
	} else {
		res.status(400).json({ message: 'No ticket created' });
	}
});

const updateTicket = asyncHandler(async (req, res) => {
	const { id, title, text, user, complete } = req.body;
	//confirm notes exist to update
	const ticket = await Ticket.findById(id).exec();
	if (!ticket) {
		return res.status(400).json({ message: 'No ticket to update' });
	}

	//check for duplicate title
	const duplicate = Ticket.findOne({ title }).lean().exec();

	//
	// if (duplicate || duplicate?._id.toString() !== id) {
	// 	return res.status(400).json({ message: 'Ticket title already exists' });
	// }
	ticket.user = user;
	ticket.title = title;
	ticket.text = text;
	ticket.complete = complete;

	const updatedTicket = await ticket.save();
	res.status(200).json({ message: `Ticket ${updatedTicket._id} updated` });
});

module.exports = { getAllTickets, createNewTicket, updateTicket };
