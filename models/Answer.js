
const mongoose = require("mongoose")

const schema = mongoose.Schema({
	author: mongoose.Schema.Types.ObjectId,
	description: String,
	likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comment: [mongoose.Schema.Types.ObjectId]
})

module.exports = mongoose.model("Answer", schema)