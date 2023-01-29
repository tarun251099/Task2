
const mongoose = require("mongoose")

const schema = mongoose.Schema({
	author: mongoose.Schema.Types.ObjectId,
	title: String,
	description: String,
	likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    ans: [mongoose.Schema.Types.ObjectId]
})

module.exports = mongoose.model("Question", schema)