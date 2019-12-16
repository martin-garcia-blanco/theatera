const { Schema } = require('mongoose')
const Person = require('./person')

module.exports = new Schema({
    title: {
        type: String,
        required: true,
    },
    startDate: {
        type: Number
    },
    endDate: {
        type: Number
    },
    body: {
        type: String,
        required: true
    },
    type: {
        required: true,
        type: String,
        enum: ['EDUCATION', 'JOB']
    }
})