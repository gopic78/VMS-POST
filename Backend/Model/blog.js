const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    created_date: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false })

module.exports = mongoose.model("blogs", blogSchema);