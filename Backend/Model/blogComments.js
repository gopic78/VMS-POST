const mongoose = require("mongoose");

const blogCommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogs",
        required : true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required : true
    },
    created_date: {
        type: Date,
        default: Date.now
    }

}, { versionKey: false })

module.exports = mongoose.model("blogcomments", blogCommentSchema);