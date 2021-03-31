const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Test: {
        type: Number,
        required: true,
        min: 0
    },
    ODI: {
        type: Number,
        required: true,
        min: 0
    },
    T20: {
        type: Number,
        required: true,
        min: 0
    },
    about: {
        type: String
    },
    image: {
        type: String
    }
})

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;