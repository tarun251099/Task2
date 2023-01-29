
const mongoose = require("mongoose")

const schema = mongoose.Schema({
	author: mongoose.Schema.Types.ObjectId,
	description: String,
})

module.exports = mongoose.model("Comment", schema)