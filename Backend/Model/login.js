const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    created_date: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model("users", loginSchema);
