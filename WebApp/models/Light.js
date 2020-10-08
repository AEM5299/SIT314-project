const mongoose = require('mongoose');

module.exports = mongoose.model(
    "Light",
    new mongoose.Schema({
        nickname: String,
        room: String,
        status: { type: Boolean, default: false },
        color: { type: String, default: '#ffffff' }
    })
);