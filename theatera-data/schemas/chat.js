const { Schema, ObjectId } = require('mongoose')
const Message = require('./message')

module.exports = new Schema({
    users: {
        type: [ObjectId],
        require: true,
        ref: 'User'
    },
    messages: {
        type: [Message],
        default: []
    },
    checked:{
        type: Boolean,
        default: false
    }
})