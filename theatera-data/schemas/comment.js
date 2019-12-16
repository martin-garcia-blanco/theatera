const { Schema, ObjectId } = require('mongoose')

module.exports = new Schema({
    user: {
        type: ObjectId,
        require: true,
        ref: 'User'
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})