const { Schema, ObjectId } = require('mongoose')

module.exports = new Schema({
    creator: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    receiver: {
        type: ObjectId,
        required: true,
        ref: 'User'
    }
})