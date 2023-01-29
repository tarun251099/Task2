const mongoose = require("mongoose")

const schema = mongoose.Schema({
	name: String,
	designation: String,
	email: String,
	pass: String,
})

module.exports = mongoose.model("User", schema)