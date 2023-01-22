const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ticketSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			default: 'Employee',
		},

		complete: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
); // it's option and adds createdAt and updatedAt);

ticketSchema.plugin(AutoIncrement, {
	inc_field: 'ticket',
	id: 'ticketNums',
	start_seq: 600,
});

module.exports = mongoose.model('Ticket', ticketSchema);
