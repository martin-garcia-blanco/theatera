const { Schema } = require('mongoose')

module.exports = new Schema({
    surname: {
        type: String,
    },
    age: {
        type: Number,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    languages: {
        type: [String],
    },
    gender: {
        type: String,
        enum: ['MAN', 'WOMAN'],
    }
})